<?php
// api/bible_highlights.php
header('Content-Type: application/json');
require_once(__DIR__ . '/../config/db_config.php');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    $db = getMySQLConnection();
    $user_id = getCurrentUserId();
    
    switch ($action) {
        case 'get':
            // Get all highlights for a specific chapter
            $version = $_GET['version'] ?? '';
            $book_id = $_GET['book_id'] ?? 0;
            $chapter = $_GET['chapter'] ?? 0;
            
            if (!$version || !$book_id || !$chapter) {
                throw new Exception('Missing required parameters');
            }
            
            $stmt = $db->prepare("
                SELECT verse, color, note, created_at
                FROM user_highlights
                WHERE user_id = ? AND version_code = ? AND book_id = ? AND chapter = ?
                ORDER BY verse
            ");
            $stmt->execute([$user_id, $version, $book_id, $chapter]);
            $highlights = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'highlights' => $highlights
            ]);
            break;
            
        case 'list':
            // Get all highlights for user (for highlights management page)
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
            
            $stmt = $db->prepare("
                SELECT 
                    h.id,
                    h.version_code,
                    h.book_id,
                    h.chapter,
                    h.verse,
                    h.color,
                    h.note,
                    h.created_at
                FROM user_highlights h
                WHERE h.user_id = ?
                ORDER BY h.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$user_id, $limit]);
            $highlights = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'highlights' => $highlights,
                'count' => count($highlights)
            ]);
            break;
            
        case 'save':
            // Save or update a highlight
            $version = $_POST['version'] ?? '';
            $book_id = intval($_POST['book_id'] ?? 0);
            $chapter = intval($_POST['chapter'] ?? 0);
            $verse = intval($_POST['verse'] ?? 0);
            $color = $_POST['color'] ?? 'yellow';
            $note = $_POST['note'] ?? '';
            
            if (!$version || !$book_id || !$chapter || !$verse) {
                throw new Exception('Missing required parameters');
            }
            
            // Validate color
            $validColors = ['yellow', 'green', 'blue', 'pink', 'orange', 'purple'];
            if (!in_array($color, $validColors)) {
                $color = 'yellow';
            }
            
            // Insert or update using MySQL syntax
            $stmt = $db->prepare("
                INSERT INTO user_highlights (user_id, version_code, book_id, chapter, verse, color, note)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    color = VALUES(color),
                    note = VALUES(note),
                    updated_at = CURRENT_TIMESTAMP
            ");
            
            $stmt->execute([$user_id, $version, $book_id, $chapter, $verse, $color, $note]);
            
            $highlightId = $db->lastInsertId() ?: $stmt->rowCount();
            
            echo json_encode([
                'success' => true,
                'id' => $highlightId,
                'message' => 'Highlight saved successfully'
            ]);
            break;
            
        case 'delete':
            // Delete a highlight
            $version = $_POST['version'] ?? '';
            $book_id = intval($_POST['book_id'] ?? 0);
            $chapter = intval($_POST['chapter'] ?? 0);
            $verse = intval($_POST['verse'] ?? 0);
            
            if (!$version || !$book_id || !$chapter || !$verse) {
                throw new Exception('Missing required parameters');
            }
            
            $stmt = $db->prepare("
                DELETE FROM user_highlights 
                WHERE user_id = ? AND version_code = ? AND book_id = ? AND chapter = ? AND verse = ?
            ");
            $stmt->execute([$user_id, $version, $book_id, $chapter, $verse]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Highlight deleted successfully'
            ]);
            break;
            
        case 'stats':
            // Get highlight statistics for user
            $stmt = $db->prepare("
                SELECT 
                    COUNT(*) as total_highlights,
                    COUNT(DISTINCT version_code) as versions_used,
                    COUNT(DISTINCT book_id) as books_highlighted
                FROM user_highlights
                WHERE user_id = ?
            ");
            $stmt->execute([$user_id]);
            $stats = $stmt->fetch();
            
            $stmt = $db->prepare("
                SELECT color, COUNT(*) as color_count
                FROM user_highlights
                WHERE user_id = ?
                GROUP BY color
            ");
            $stmt->execute([$user_id]);
            $colorStats = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'total_highlights' => $stats['total_highlights'],
                'versions_used' => $stats['versions_used'],
                'books_highlighted' => $stats['books_highlighted'],
                'by_color' => $colorStats
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