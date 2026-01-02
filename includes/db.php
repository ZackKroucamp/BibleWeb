<?php
// Database configuration
$host     = "localhost";
$dbname   = "bible_web";
$dbuser   = "root"; // XAMPP default
$dbpass   = "";     // XAMPP default has no password

// Create connection
$conn = new mysqli($host, $dbuser, $dbpass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Optional: set charset to utf8mb4 for proper Unicode support
$conn->set_charset("utf8mb4");
?>
