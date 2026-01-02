<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class BibleAPI {
    private $sqliteDir = './sqlite/';
    
    public function __construct() {
        // Ensure SQLite directory exists
        if (!is_dir($this->sqliteDir)) {
            $this->sendError('SQLite directory not found. Please ensure the sqlite folder is in the same directory as this file.');
        }
    }
    
    public function handleRequest() {
        $action = $_GET['action'] ?? '';
        
        try {
            switch ($action) {
                case 'get_versions':
                    $this->getVersions();
                    break;
                case 'get_books':
                    $this->getBooks($_GET['version'] ?? '');
                    break;
                case 'get_chapters':
                    $this->getChapters($_GET['version'] ?? '', $_GET['book'] ?? '');
                    break;
                case 'get_verses':
                    $this->getVerses($_GET['version'] ?? '', $_GET['book'] ?? '', $_GET['chapter'] ?? '');
                    break;
                case 'get_verse_count':
                    $this->getVerseCount($_GET['version'] ?? '', $_GET['book'] ?? '', $_GET['chapter'] ?? '');
                    break;
                default:
                    $this->sendError('Invalid action');
            }
        } catch (Exception $e) {
            $this->sendError('Error: ' . $e->getMessage());
        }
    }
    
    private function getVersions() {
        $versions = [];
        $files = glob($this->sqliteDir . '*.db');
        
        foreach ($files as $file) {
            $filename = basename($file, '.db');
            $displayName = $this->getVersionDisplayName($filename);
            $versions[] = [
                'code' => $filename,
                'name' => $displayName,
                'file' => $file
            ];
        }
        
        // Sort versions, putting KJV first if it exists
        usort($versions, function($a, $b) {
            if ($a['code'] === 'kjv') return -1;
            if ($b['code'] === 'kjv') return 1;
            return strcmp($a['name'], $b['name']);
        });
        
        $this->sendSuccess($versions);
    }
    //still need to get the nasb key and esv and more 
    private function getVersionDisplayName($code) {
        $versionNames = [
            'kjv' => 'King James Version (KJV)',
            'niv' => 'New International Version (NIV)',
            'esv' => 'English Standard Version (ESV)',
            'nasb' => 'New American Standard Bible (NASB)',
            'nlt' => 'New Living Translation (NLT)',
            'msg' => 'The Message (MSG)',
            'amp' => 'Amplified Bible (AMP)',
            'nkjv' => 'New King James Version (NKJV)',
            'rsv' => 'Revised Standard Version (RSV)',
            'asv' => 'American Standard Version (ASV)',
            'darby' => 'Darby Translation',
            'ylt' => "Young's Literal Translation (YLT)",
            'web' => 'World English Bible (WEB)',
            'bb' => 'Bible in Basic English (BBE)',
            'akjv' => 'American King James Version (AKJV)'
        ];
        
        return $versionNames[strtolower($code)] ?? strtoupper($code);
    }
    
    private function getBooks($version) {
        if (empty($version)) {
            $this->sendError('Version parameter required');
        }
        
        $db = $this->connectToDatabase($version);
        if (!$db) return;
        
        // Try different possible table structures
        $queries = [
            "SELECT DISTINCT book_number, book_name FROM verses ORDER BY book_number",
            "SELECT DISTINCT book as book_number, book_name FROM bible ORDER BY book",
            "SELECT DISTINCT book_id as book_number, book_name FROM books ORDER BY book_id",
            "SELECT DISTINCT book_number, book_name FROM bible ORDER BY book_number"
        ];
        
        $books = [];
        foreach ($queries as $query) {
            try {
                $result = $db->query($query);
                if ($result) {
                    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                        $books[] = [
                            'number' => (int)$row['book_number'],
                            'name' => $row['book_name']
                        ];
                    }
                    break; // If successful, break out of loop
                }
            } catch (Exception $e) {
                continue; // Try next query
            }
        }
        
        if (empty($books)) {
            // Fallback: try to get table structure
            $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchArray();
            $this->sendError('Could not retrieve books. Available tables: ' . print_r($tables, true));
        }
        
        $db->close();
        $this->sendSuccess($books);
    }
    
    private function getChapters($version, $book) {
        if (empty($version) || empty($book)) {
            $this->sendError('Version and book parameters required');
        }
        
        $db = $this->connectToDatabase($version);
        if (!$db) return;
        
        // Try different possible queries
        $queries = [
            "SELECT DISTINCT chapter FROM verses WHERE book_number = ? ORDER BY chapter",
            "SELECT DISTINCT chapter FROM bible WHERE book = ? ORDER BY chapter",
            "SELECT DISTINCT chapter_number as chapter FROM bible WHERE book_number = ? ORDER BY chapter_number"
        ];
        
        $chapters = [];
        foreach ($queries as $query) {
            try {
                $stmt = $db->prepare($query);
                $stmt->bindValue(1, $book, SQLITE3_INTEGER);
                $result = $stmt->execute();
                
                if ($result) {
                    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                        $chapters[] = (int)$row['chapter'];
                    }
                    break;
                }
            } catch (Exception $e) {
                continue;
            }
        }
        
        $db->close();
        $this->sendSuccess($chapters);
    }
    
    private function getVerses($version, $book, $chapter) {
        if (empty($version) || empty($book) || empty($chapter)) {
            $this->sendError('Version, book, and chapter parameters required');
        }
        
        $db = $this->connectToDatabase($version);
        if (!$db) return;
        
        // Try different possible queries
        $queries = [
            "SELECT verse, text FROM verses WHERE book_number = ? AND chapter = ? ORDER BY verse",
            "SELECT verse, text FROM bible WHERE book = ? AND chapter = ? ORDER BY verse",
            "SELECT verse_number as verse, verse_text as text FROM bible WHERE book_number = ? AND chapter_number = ? ORDER BY verse_number"
        ];
        
        $verses = [];
        foreach ($queries as $query) {
            try {
                $stmt = $db->prepare($query);
                $stmt->bindValue(1, $book, SQLITE3_INTEGER);
                $stmt->bindValue(2, $chapter, SQLITE3_INTEGER);
                $result = $stmt->execute();
                
                if ($result) {
                    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                        $verses[] = [
                            'verse' => (int)$row['verse'],
                            'text' => $row['text']
                        ];
                    }
                    break;
                }
            } catch (Exception $e) {
                continue;
            }
        }
        
        $db->close();
        $this->sendSuccess($verses);
    }
    
    private function getVerseCount($version, $book, $chapter) {
        if (empty($version) || empty($book) || empty($chapter)) {
            $this->sendError('Version, book, and chapter parameters required');
        }
        
        $db = $this->connectToDatabase($version);
        if (!$db) return;
        
        $queries = [
            "SELECT COUNT(*) as count FROM verses WHERE book_number = ? AND chapter = ?",
            "SELECT COUNT(*) as count FROM bible WHERE book = ? AND chapter = ?",
            "SELECT COUNT(*) as count FROM bible WHERE book_number = ? AND chapter_number = ?"
        ];
        
        $count = 0;
        foreach ($queries as $query) {
            try {
                $stmt = $db->prepare($query);
                $stmt->bindValue(1, $book, SQLITE3_INTEGER);
                $stmt->bindValue(2, $chapter, SQLITE3_INTEGER);
                $result = $stmt->execute();
                
                if ($result) {
                    $row = $result->fetchArray(SQLITE3_ASSOC);
                    $count = (int)$row['count'];
                    break;
                }
            } catch (Exception $e) {
                continue;
            }
        }
        
        $db->close();
        $this->sendSuccess(['count' => $count]);
    }
    
    private function connectToDatabase($version) {
        $dbFile = $this->sqliteDir . $version . '.db';
        
        if (!file_exists($dbFile)) {
            $this->sendError("Database file not found: $version.db");
            return false;
        }
        
        try {
            $db = new SQLite3($dbFile, SQLITE3_OPEN_READONLY);
            $db->busyTimeout(5000); // 5 second timeout
            return $db;
        } catch (Exception $e) {
            $this->sendError("Could not connect to database: " . $e->getMessage());
            return false;
        }
    }
    
    private function sendSuccess($data) {
        echo json_encode(['success' => true, 'data' => $data]);
        exit;
    }
    
    private function sendError($message) {
        echo json_encode(['success' => false, 'error' => $message]);
        exit;
    }
}

// Handle the request wohooo
$api = new BibleAPI();
$api->handleRequest();
?>