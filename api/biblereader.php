<?php
// api/biblereader.php
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$sqliteDir = __DIR__ . '/../sqlite/';

try {
    switch ($action) {
        case 'get_versions':
            // Scan the sqlite directory for all .db files
            $files = glob($sqliteDir . '*.db');
            $versions = [];
            
            foreach ($files as $file) {
                $filename = basename($file, '.db');
                
                // Try to get the full name from translations table
                try {
                    $db = new PDO('sqlite:' . $file);
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
                    $stmt = $db->query("SELECT title FROM translations WHERE translation = '{$filename}' LIMIT 1");
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    $fullName = $result ? $result['title'] : $filename;
                } catch (Exception $e) {
                    // If translations table doesn't exist, use filename
                    $fullName = $filename;
                }
                
                $versions[] = [
                    'code' => $filename,
                    'name' => $fullName,
                    'file' => $file
                ];
            }
            
            // Sort by code
            usort($versions, function($a, $b) {
                return strcmp($a['code'], $b['code']);
            });
            
            echo json_encode(['success' => true, 'versions' => $versions]);
            break;

        case 'get_books':
            $version = $_GET['version'] ?? '';
            
            if (!$version) {
                throw new Exception('Version is required');
            }
            
            $dbFile = $sqliteDir . $version . '.db';
            
            if (!file_exists($dbFile)) {
                throw new Exception('Bible version not found');
            }
            
            $db = new PDO('sqlite:' . $dbFile);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Get books from {VERSION}_books table
            $stmt = $db->query("SELECT id, name FROM {$version}_books ORDER BY id");
            $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get chapter count for each book
            foreach ($books as &$book) {
                $stmt = $db->prepare("SELECT MAX(chapter) as max_chapter FROM {$version}_verses WHERE book_id = ?");
                $stmt->execute([$book['id']]);
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $book['chapters_count'] = $result['max_chapter'] ?? 0;
            }
            
            echo json_encode(['success' => true, 'books' => $books]);
            break;

        case 'get_verses':
            $version = $_GET['version'] ?? '';
            $book_id = $_GET['book_id'] ?? 0;
            $chapter = $_GET['chapter'] ?? 0;

            if (!$version || !$book_id || !$chapter) {
                throw new Exception('Missing required parameters');
            }
            
            $dbFile = $sqliteDir . $version . '.db';
            
            if (!file_exists($dbFile)) {
                throw new Exception('Bible version not found');
            }
            
            $db = new PDO('sqlite:' . $dbFile);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Get book name
            $stmt = $db->prepare("SELECT name FROM {$version}_books WHERE id = ?");
            $stmt->execute([$book_id]);
            $book = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$book) {
                throw new Exception('Book not found');
            }
            
            // Get verses
            $stmt = $db->prepare("
                SELECT verse, text 
                FROM {$version}_verses 
                WHERE book_id = ? AND chapter = ? 
                ORDER BY verse
            ");
            $stmt->execute([$book_id, $chapter]);
            $verses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($verses)) {
                throw new Exception('No verses found for this selection');
            }
            
            // Get version info
            $versionInfo = $version;
            try {
                $stmt = $db->query("SELECT title FROM translations WHERE translation = '{$version}' LIMIT 1");
                $transResult = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($transResult) {
                    $versionInfo = $transResult['title'] . ' (' . $version . ')';
                }
            } catch (Exception $e) {
                // Translations table doesn't exist, use code only
            }
            
            echo json_encode([
                'success' => true,
                'version_name' => $versionInfo,
                'book_name' => $book['name'],
                'chapter' => $chapter,
                'verses' => $verses
            ]);
            break;

        default:
            throw new Exception('Invalid action');
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>