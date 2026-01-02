<?php
session_start();

// If already logged in → show main UI
$isLoggedIn = isset($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shalom Scripture</title>
    <link rel="stylesheet" href="/bibleweb/assets/css/styles.css">
    <script src="/bibleweb/assets/js/login.js" defer></script>
</head>
<body>

<?php if (!$isLoggedIn): ?>
    <?php include "includes/login.php"; ?>
<?php else: ?>
    <?php include "modules/home.php"; ?>
<?php endif; ?>

</body>
</html>
