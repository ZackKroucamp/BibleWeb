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

try {
    // Get user's family tree
    $stmt = $conn->prepare("SELECT tree_name, tree_data, description, updated_at FROM user_family_trees WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $tree = $result->fetch_assoc();
    $stmt->close();
    
    if ($tree) {
        echo json_encode([
            'success' => true,
            'tree_name' => $tree['tree_name'],
            'tree_data' => $tree['tree_data'],
            'description' => $tree['description'],
            'updated_at' => $tree['updated_at']
        ]);
    } else {
        // No saved tree found
        echo json_encode([
            'success' => false,
            'message' => 'No saved family tree found'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>