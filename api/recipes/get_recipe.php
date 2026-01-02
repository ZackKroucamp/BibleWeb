<?php
// api/recipes/get_recipe.php
header('Content-Type: application/json');
require_once(__DIR__ . '/../../includes/db.php');

try {
    $slug = $_GET['slug'] ?? '';
    
    if (!$slug) {
        throw new Exception('Recipe slug is required');
    }
    
    $dbFile = __DIR__ . '/../../sqlite/recipes.db';
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get recipe
    $stmt = $pdo->prepare("SELECT * FROM recipes WHERE recipe_slug = ?");
    $stmt->execute([$slug]);
    $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$recipe) {
        throw new Exception('Recipe not found');
    }
    
    // Get ingredients
    $stmt = $pdo->prepare("
        SELECT i.*, ri.quantity, ri.preparation_note, ri.is_optional
        FROM recipe_ingredients ri
        INNER JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
        ORDER BY ri.recipe_ingredient_id
    ");
    $stmt->execute([$recipe['recipe_id']]);
    $recipe['ingredients'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get scripture references
    $stmt = $pdo->prepare("
        SELECT * FROM recipe_scripture_refs 
        WHERE recipe_id = ? 
        ORDER BY reference_type, book_name, chapter, verse_start
    ");
    $stmt->execute([$recipe['recipe_id']]);
    $recipe['scripture_refs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get steps
    $stmt = $pdo->prepare("
        SELECT * FROM recipe_steps 
        WHERE recipe_id = ? 
        ORDER BY step_number
    ");
    $stmt->execute([$recipe['recipe_id']]);
    $recipe['steps'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get periods
    $stmt = $pdo->prepare("
        SELECT p.* FROM recipe_periods rp
        INNER JOIN periods p ON rp.period_id = p.period_id
        WHERE rp.recipe_id = ?
    ");
    $stmt->execute([$recipe['recipe_id']]);
    $recipe['periods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get locations
    $stmt = $pdo->prepare("
        SELECT l.* FROM recipe_locations rl
        INNER JOIN locations l ON rl.location_id = l.location_id
        WHERE rl.recipe_id = ?
    ");
    $stmt->execute([$recipe['recipe_id']]);
    $recipe['locations'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get tags
    $stmt = $pdo->prepare("
        SELECT t.* FROM recipe_tags rt
        INNER JOIN tags t ON rt.tag_id = t.tag_id
        WHERE rt.recipe_id = ?
    ");
    $stmt->execute([$recipe['recipe_id']]);
    $recipe['tags'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $recipe
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}