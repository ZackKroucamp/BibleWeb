<?php
// api/recipes/get_recipes.php
header('Content-Type: application/json');
require_once(__DIR__ . '/../../includes/db.php');

try {
    $dbFile = __DIR__ . '/../../sqlite/recipes.db';
    
    if (!file_exists($dbFile)) {
        throw new Exception('Recipes database not found');
    }
    
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Filters
    $period = $_GET['period'] ?? null;
    $ingredient = $_GET['ingredient'] ?? null;
    $tag = $_GET['tag'] ?? null;
    $search = $_GET['search'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Base query
    $query = "SELECT DISTINCT r.* FROM recipes r WHERE 1=1";
    $params = [];
    
    // Filter by period
    if ($period) {
        $query .= " AND r.recipe_id IN (
            SELECT rp.recipe_id FROM recipe_periods rp
            INNER JOIN periods p ON rp.period_id = p.period_id
            WHERE p.period_slug = ?
        )";
        $params[] = $period;
    }
    
    // Filter by ingredient
    if ($ingredient) {
        $query .= " AND r.recipe_id IN (
            SELECT ri.recipe_id FROM recipe_ingredients ri
            INNER JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
            WHERE i.ingredient_slug = ?
        )";
        $params[] = $ingredient;
    }
    
    // Filter by tag
    if ($tag) {
        $query .= " AND r.recipe_id IN (
            SELECT rt.recipe_id FROM recipe_tags rt
            INNER JOIN tags t ON rt.tag_id = t.tag_id
            WHERE t.tag_slug = ?
        )";
        $params[] = $tag;
    }
    
    // Search
    if ($search) {
        $query .= " AND (r.recipe_name LIKE ? OR r.description LIKE ?)";
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $query .= " ORDER BY r.recipe_name LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get total count
    $countQuery = str_replace('SELECT DISTINCT r.*', 'SELECT COUNT(DISTINCT r.recipe_id)', 
                             substr($query, 0, strpos($query, 'ORDER BY')));
    $countStmt = $pdo->prepare($countQuery);
    $countStmt->execute(array_slice($params, 0, -2));
    $total = $countStmt->fetchColumn();
    
    echo json_encode([
        'success' => true,
        'data' => $recipes,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}