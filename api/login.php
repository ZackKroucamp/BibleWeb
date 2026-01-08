<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Start session
session_start();

try {
    // Include database connection
    require_once(__DIR__ . '/../config/db_config.php');
    
    // Get PDO connection
    $conn = getMySQLConnection();
    
    // Get input data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate input
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }
    
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');
    
    if (empty($username) || empty($password)) {
        echo json_encode([
            "success" => false,
            "message" => "Username and password are required"
        ]);
        exit;
    }
    
    // Query with PDO instead of mysqli
    $stmt = $conn->prepare("
        SELECT id, username, password_hash, email, active 
        FROM users 
        WHERE username = ? AND active = 1
    ");
    
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Use password_verify for hashed passwords
        if (password_verify($password, $user['password_hash'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Update last login timestamp
            $updateStmt = $conn->prepare("UPDATE users SET updated_at = datetime('now') WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            
            // Return success with user data
            echo json_encode([
                "success" => true,
                "user" => [
                    "user_id" => $user['id'],
                    "username" => $user['username'],
                    "email" => $user['email'] ?? '',
                    "full_name" => $user['username']
                ]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Invalid password"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "User not found or account is inactive"
        ]);
    }
    
} catch (Exception $e) {
    // Log error for debugging
    error_log("Login error: " . $e->getMessage());
    
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>