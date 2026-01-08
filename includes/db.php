<?php
$dbname = "bible_web.db";

try {
    $conn = new PDO("sqlite:" . $dbname);
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $conn->exec("PRAGMA foreign_keys = ON;");
    
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>