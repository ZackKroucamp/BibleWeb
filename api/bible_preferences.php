<?php
// api/bible_preferences.php
header('Content-Type: application/json');
require_once(__DIR__ . '/../config/db_config.php');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    $db = getMySQLConnection();
    $user_id = getCurrentUserId();
    
    switch ($action) {
        case 'get':
            // Get user preferences
            $stmt = $db->prepare("
                SELECT * FROM user_preferences WHERE user_id = ?
            ");
            $stmt->execute([$user_id]);
            $prefs = $stmt->fetch();
            
            // Return defaults if no preferences exist
            if (!$prefs) {
                $prefs = [
                    'user_id' => $user_id,
                    'theme' => 'dark',
                    'font_size' => 16,
                    'default_version' => 'KJV',
                    'parallel_view_enabled' => 0,
                    'parallel_version' => null,
                    'sync_scroll' => 1
                ];
            }
            
            echo json_encode([
                'success' => true,
                'preferences' => $prefs
            ]);
            break;
            
        case 'save':
            // Save/update preferences
            $theme = $_POST['theme'] ?? 'dark';
            $fontSize = intval($_POST['font_size'] ?? 16);
            $defaultVersion = $_POST['default_version'] ?? 'KJV';
            $parallelEnabled = intval($_POST['parallel_view_enabled'] ?? 0);
            $parallelVersion = $_POST['parallel_version'] ?? null;
            $syncScroll = intval($_POST['sync_scroll'] ?? 1);
            
            // Validate values
            if (!in_array($theme, ['light', 'dark'])) {
                $theme = 'dark';
            }
            
            if ($fontSize < 12 || $fontSize > 24) {
                $fontSize = 16;
            }
            
            // Insert or update using MySQL syntax
            $stmt = $db->prepare("
                INSERT INTO user_preferences 
                (user_id, theme, font_size, default_version, parallel_view_enabled, parallel_version, sync_scroll)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    theme = VALUES(theme),
                    font_size = VALUES(font_size),
                    default_version = VALUES(default_version),
                    parallel_view_enabled = VALUES(parallel_view_enabled),
                    parallel_version = VALUES(parallel_version),
                    sync_scroll = VALUES(sync_scroll),
                    updated_at = CURRENT_TIMESTAMP
            ");
            
            $stmt->execute([
                $user_id,
                $theme,
                $fontSize,
                $defaultVersion,
                $parallelEnabled,
                $parallelVersion,
                $syncScroll
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Preferences saved successfully'
            ]);
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>