<?php
// api/bible_crossrefs.php
header('Content-Type: application/json');

$action = $_GET['action'] ?? 'get';
$extrasDir = __DIR__ . '/../sqlite/extras/';

try {
    switch ($action) {
        case 'get':
            $book = $_GET['book'] ?? '';
            $chapter = intval($_GET['chapter'] ?? 0);
            $verse = intval($_GET['verse'] ?? 0);
            
            if (empty($book) || !$chapter || !$verse) {
                throw new Exception('Missing required parameters: book, chapter, verse');
            }
            
            $crossRefs = [];
            
            // Search through all cross-reference databases
            $dbFiles = glob($extrasDir . 'cross_references_*.db');
            
            foreach ($dbFiles as $dbFile) {
                try {
                    $db = new PDO('sqlite:' . $dbFile);
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
                    $stmt = $db->prepare("
                        SELECT 
                            from_book,
                            from_chapter,
                            from_verse,
                            to_book,
                            to_chapter,
                            to_verse_start,
                            to_verse_end,
                            votes
                        FROM cross_references
                        WHERE from_book = ? AND from_chapter = ? AND from_verse = ?
                        ORDER BY votes DESC
                    ");
                    
                    $stmt->execute([$book, $chapter, $verse]);
                    $refs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    $crossRefs = array_merge($crossRefs, $refs);
                    
                } catch (Exception $e) {
                    // Skip databases that don't have the expected structure
                    continue;
                }
            }
            
            // Sort by votes (highest first) and remove duplicates
            usort($crossRefs, function($a, $b) {
                return $b['votes'] - $a['votes'];
            });
            
            // Remove duplicates based on reference
            $unique = [];
            $seen = [];
            foreach ($crossRefs as $ref) {
                $key = $ref['to_book'] . '_' . $ref['to_chapter'] . '_' . $ref['to_verse_start'];
                if (!isset($seen[$key])) {
                    $seen[$key] = true;
                    $unique[] = $ref;
                }
            }
            
            echo json_encode([
                'success' => true,
                'references' => $unique,
                'count' => count($unique)
            ]);
            break;
            
        case 'reverse':
            // Get verses that reference this verse (reverse lookup)
            $book = $_GET['book'] ?? '';
            $chapter = intval($_GET['chapter'] ?? 0);
            $verse = intval($_GET['verse'] ?? 0);
            
            if (empty($book) || !$chapter || !$verse) {
                throw new Exception('Missing required parameters');
            }
            
            $reverseCrossRefs = [];
            $dbFiles = glob($extrasDir . 'cross_references_*.db');
            
            foreach ($dbFiles as $dbFile) {
                try {
                    $db = new PDO('sqlite:' . $dbFile);
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
                    $stmt = $db->prepare("
                        SELECT 
                            from_book,
                            from_chapter,
                            from_verse,
                            to_book,
                            to_chapter,
                            to_verse_start,
                            to_verse_end,
                            votes
                        FROM cross_references
                        WHERE to_book = ? 
                          AND to_chapter = ? 
                          AND to_verse_start <= ? 
                          AND (to_verse_end >= ? OR to_verse_end IS NULL)
                        ORDER BY votes DESC
                    ");
                    
                    $stmt->execute([$book, $chapter, $verse, $verse]);
                    $refs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    $reverseCrossRefs = array_merge($reverseCrossRefs, $refs);
                    
                } catch (Exception $e) {
                    continue;
                }
            }
            
            // Sort and deduplicate
            usort($reverseCrossRefs, function($a, $b) {
                return $b['votes'] - $a['votes'];
            });
            
            $unique = [];
            $seen = [];
            foreach ($reverseCrossRefs as $ref) {
                $key = $ref['from_book'] . '_' . $ref['from_chapter'] . '_' . $ref['from_verse'];
                if (!isset($seen[$key])) {
                    $seen[$key] = true;
                    $unique[] = $ref;
                }
            }
            
            echo json_encode([
                'success' => true,
                'references' => $unique,
                'count' => count($unique)
            ]);
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>