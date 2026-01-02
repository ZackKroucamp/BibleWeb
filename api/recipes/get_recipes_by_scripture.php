<?php
// api/recipes/get_recipes_by_scripture.php
header('Content-Type: application/json');
require_once(__DIR__ . '/../../includes/db.php');

try {
    $book = $_GET['book'] ?? '';
    $chapter = isset($_GET['chapter']) ? (int)$_GET['chapter'] : null;
    
    if (!$book) {
        throw new Exception('Book name is required');
    }
    
    $dbFile = __DIR__ . '/../../sqlite/recipes.db';
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = "
        SELECT DISTINCT r.*, rsr.book_name, rsr.chapter, rsr.verse_start, rsr.verse_end
        FROM recipes r
        INNER JOIN recipe_scripture_refs rsr ON r.recipe_id = rsr.recipe_id
        WHERE rsr.book_name = ?
    ";
    
    $params = [$book];
    
    if ($chapter) {
        $query .= " AND rsr.chapter = ?";
        $params[] = $chapter;
    }
    
    $query .= " ORDER BY r.recipe_name";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $recipes,
        'book' => $book,
        'chapter' => $chapter,
        'count' => count($recipes)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}