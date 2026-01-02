<?php
// Prevent any output before JSON
ob_start();

session_start();

// Set JSON header first
header('Content-Type: application/json');

// Check if db.php exists
if (!file_exists(__DIR__ . '/../includes/db.php')) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Database configuration file not found']);
    exit;
}

require_once(__DIR__ . '/../includes/db.php');

// Check if MySQLi connection exists
if (!isset($conn) || $conn->connect_error) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Database connection not available']);
    exit;
}

// Clear any output buffering
ob_end_clean();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['tree_name']) || !isset($input['tree_data'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$tree_name = $input['tree_name'];
$tree_data = $input['tree_data'];
$description = isset($input['description']) ? $input['description'] : '';

try {
    // Check if user already has a tree saved
    $stmt = $conn->prepare("SELECT id FROM user_family_trees WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing = $result->fetch_assoc();
    $stmt->close();
    
    if ($existing) {
        // Update existing tree
        $stmt = $conn->prepare("
            UPDATE user_family_trees 
            SET tree_name = ?, tree_data = ?, description = ?, updated_at = NOW() 
            WHERE user_id = ?
        ");
        $stmt->bind_param("sssi", $tree_name, $tree_data, $description, $user_id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Family tree updated successfully',
                'action' => 'update'
            ]);
        } else {
            throw new Exception($stmt->error);
        }
        $stmt->close();
    } else {
        // Insert new tree
        $stmt = $conn->prepare("
            INSERT INTO user_family_trees (user_id, tree_name, tree_data, description, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())
        ");
        $stmt->bind_param("isss", $user_id, $tree_name, $tree_data, $description);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true, 
                'message' => 'Family tree saved successfully',
                'action' => 'insert',
                'tree_id' => $conn->insert_id
            ]);
        } else {
            throw new Exception($stmt->error);
        }
        $stmt->close();
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>