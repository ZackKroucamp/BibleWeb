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
    require_once(__DIR__ . '/../includes/db.php');
    
    // Check if database connection exists
    if (!isset($conn) || $conn === null) {
        throw new Exception("Database connection failed");
    }
    
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
    
    // Query with correct column names matching your database
    $stmt = $conn->prepare("
        SELECT id, username, password_hash, email, active 
        FROM users 
        WHERE username = ? AND active = 1
    ");
    
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    
    $stmt->bind_param("s", $username);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute statement: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        // Use password_verify for hashed passwords
        if (password_verify($password, $user['password_hash'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Update last login timestamp
            $updateStmt = $conn->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?");
            if ($updateStmt) {
                $updateStmt->bind_param("i", $user['id']);
                $updateStmt->execute();
                $updateStmt->close();
            }
            
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
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    // Log error for debugging
    error_log("Login error: " . $e->getMessage());
    
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>