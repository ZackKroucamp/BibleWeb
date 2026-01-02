<?php
// api/recipes/get_filters.php
// Returns available filter options
header('Content-Type: application/json');
require_once(__DIR__ . '/../../includes/db.php');

try {
    $dbFile = __DIR__ . '/../../sqlite/recipes.db';
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get all periods with recipe counts
    $stmt = $pdo->query("
        SELECT p.*, COUNT(rp.recipe_id) as recipe_count
        FROM periods p
        LEFT JOIN recipe_periods rp ON p.period_id = rp.period_id
        GROUP BY p.period_id
        ORDER BY p.start_year
    ");
    $periods = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get all ingredients with recipe counts
    $stmt = $pdo->query("
        SELECT i.*, COUNT(ri.recipe_id) as recipe_count
        FROM ingredients i
        LEFT JOIN recipe_ingredients ri ON i.ingredient_id = ri.ingredient_id
        GROUP BY i.ingredient_id
        ORDER BY i.ingredient_name
    ");
    $ingredients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get all tags with recipe counts
    $stmt = $pdo->query("
        SELECT t.*, COUNT(rt.recipe_id) as recipe_count
        FROM tags t
        LEFT JOIN recipe_tags rt ON t.tag_id = rt.tag_id
        GROUP BY t.tag_id
        ORDER BY t.tag_type, t.tag_name
    ");
    $tags = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'periods' => $periods,
            'ingredients' => $ingredients,
            'tags' => $tags
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}