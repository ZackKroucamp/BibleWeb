<?php
// api/bible_search.php
// IMPORTANT: No whitespace before this tag!

// Start output buffering to prevent any output before JSON
ob_start();

// Set headers
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

$action = $_GET['action'] ?? 'search';
$sqliteDir = __DIR__ . '/../sqlite/';

try {
    switch ($action) {
        case 'search':
            $query = $_GET['query'] ?? '';
            $version = $_GET['version'] ?? 'KJV';
            $book_id = isset($_GET['book_id']) ? intval($_GET['book_id']) : null;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
            
            if (empty($query)) {
                throw new Exception('Search query is required');
            }
            
            if (strlen($query) < 3) {
                throw new Exception('Search query must be at least 3 characters');
            }
            
            $dbFile = $sqliteDir . $version . '.db';
            
            if (!file_exists($dbFile)) {
                throw new Exception('Bible version not found');
            }
            
            $db = new PDO('sqlite:' . $dbFile);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Build query with optional book filter
            $sql = "
                SELECT v.id, v.book_id, v.chapter, v.verse, v.text, b.name as book_name
                FROM {$version}_verses v
                JOIN {$version}_books b ON v.book_id = b.id
                WHERE v.text LIKE :query
            ";
            
            $params = [':query' => '%' . $query . '%'];
            
            if ($book_id !== null) {
                $sql .= " AND v.book_id = :book_id";
                $params[':book_id'] = $book_id;
            }
            
            $sql .= " ORDER BY v.book_id, v.chapter, v.verse LIMIT :limit";
            
            $stmt = $db->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Create highlighted snippets
            foreach ($results as &$result) {
                $result['snippet'] = createSnippet($result['text'], $query);
            }
            
            // Clear any unwanted output
            ob_clean();
            
            echo json_encode([
                'success' => true,
                'query' => $query,
                'version' => $version,
                'results' => $results,
                'count' => count($results)
            ], JSON_THROW_ON_ERROR);
            break;
            
        case 'search_suggest':
            $query = $_GET['query'] ?? '';
            $version = $_GET['version'] ?? 'KJV';
            
            if (strlen($query) < 2) {
                ob_clean();
                echo json_encode(['success' => true, 'suggestions' => []], JSON_THROW_ON_ERROR);
                break;
            }
            
            $dbFile = $sqliteDir . $version . '.db';
            
            if (!file_exists($dbFile)) {
                throw new Exception('Bible version not found');
            }
            
            $db = new PDO('sqlite:' . $dbFile);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $stmt = $db->prepare("
                SELECT id, name 
                FROM {$version}_books 
                WHERE name LIKE :query 
                LIMIT 10
            ");
            $stmt->execute([':query' => $query . '%']);
            $suggestions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            ob_clean();
            
            echo json_encode([
                'success' => true,
                'suggestions' => $suggestions
            ], JSON_THROW_ON_ERROR);
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
} catch (Exception $e) {
    // Clear any output and send error JSON
    ob_clean();
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_THROW_ON_ERROR);
}

// Flush output buffer
ob_end_flush();


function createSnippet($text, $query, $contextChars = 100) {
    $queryLower = strtolower($query);
    $textLower = strtolower($text);
    $pos = strpos($textLower, $queryLower);
    
    if ($pos === false) {
        return substr($text, 0, $contextChars) . '...';
    }
    
    $start = max(0, $pos - $contextChars / 2);
    $length = min(strlen($text), $contextChars + strlen($query));
    
    $snippet = substr($text, $start, $length);
    
    if ($start > 0) {
        $snippet = '...' . $snippet;
    }
    if ($start + $length < strlen($text)) {
        $snippet = $snippet . '...';
    }
    
    $snippet = preg_replace(
        '/(' . preg_quote($query, '/') . ')/i',
        '<mark>$1</mark>',
        $snippet
    );
    
    return $snippet;
}