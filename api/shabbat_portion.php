<?php
// api/shabbat_portion.php
require_once __DIR__ . '/../config/db_config.php';
// require_once __DIR__ . '/../includes/auth.php';

header('Content-Type: application/json');

try {
    $db = getMySQLConnection();
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'get_current_portion':
            getCurrentPortion($db);
            break;
            
        case 'get_portion_by_id':
            $portionId = $_GET['id'] ?? null;
            if (!$portionId) {
                throw new Exception('Portion ID required');
            }
            getPortionById($db, $portionId);
            break;
            
        case 'get_all_portions':
            getAllPortions($db);
            break;
            
        default:
            throw new Exception('Invalid action');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

/**
 * Get current Torah portion based on the Hebrew calendar cycle
 */
function getCurrentPortion($db) {
    // Get the current portion number based on the annual cycle
    $portionNumber = getCurrentPortionNumber();
    
    // Get the portion by week number
    $stmt = $db->prepare("
        SELECT * FROM torah_portions 
        WHERE week_number = ?
        LIMIT 1
    ");
    $stmt->execute([$portionNumber]);
    $portion = $stmt->fetch();
    
    // If no portion found with that week number, try by ID
    if (!$portion) {
        $stmt = $db->prepare("
            SELECT * FROM torah_portions 
            WHERE id = ?
            LIMIT 1
        ");
        $stmt->execute([$portionNumber]);
        $portion = $stmt->fetch();
    }
    
    // Final fallback to first portion
    if (!$portion) {
        $stmt = $db->prepare("SELECT * FROM torah_portions ORDER BY week_number, id LIMIT 1");
        $stmt->execute();
        $portion = $stmt->fetch();
    }
    
    if (!$portion) {
        throw new Exception('No Torah portions found in database');
    }
    
    // Get all related data
    $portionData = buildPortionData($db, $portion['id']);
    
    // Add cycle information
    $portionData['currentWeek'] = $portionNumber;
    $portionData['cycleInfo'] = getCycleInfo();
    
    echo json_encode([
        'success' => true,
        'data' => $portionData
    ]);
}

/**
 * Calculate which Torah portion we're in based on the annual cycle
 * The Torah reading cycle typically starts after Simchat Torah (usually late September/October)
 * and cycles through 54 portions over the year
 */
function getCurrentPortionNumber() {
    $now = new DateTime();
    $currentYear = (int)$now->format('Y');
    
    // Simchat Torah typically falls in late September or October
    // We'll use October 15 as an approximate start date for the cycle
    // In a real implementation, you'd want to calculate the actual date based on the Hebrew calendar
    $cycleStartMonth = 10; // October
    $cycleStartDay = 15;
    
    // Determine the year of the current cycle
    if ($now->format('n') >= $cycleStartMonth || 
        ($now->format('n') == $cycleStartMonth && $now->format('j') >= $cycleStartDay)) {
        $cycleStartYear = $currentYear;
    } else {
        $cycleStartYear = $currentYear - 1;
    }
    
    // Create the cycle start date
    $cycleStart = new DateTime("$cycleStartYear-$cycleStartMonth-$cycleStartDay");
    
    // Calculate weeks since cycle start
    $interval = $cycleStart->diff($now);
    $daysSinceCycleStart = (int)$interval->format('%a');
    
    // If we're before the cycle start, use previous year's cycle
    if ($daysSinceCycleStart < 0) {
        $cycleStart = new DateTime(($cycleStartYear - 1) . "-$cycleStartMonth-$cycleStartDay");
        $interval = $cycleStart->diff($now);
        $daysSinceCycleStart = (int)$interval->format('%a');
    }
    
    // Calculate week number (0-based, then add 1)
    $weekNumber = floor($daysSinceCycleStart / 7) + 1;
    
    // Cycle through 54 portions
    // Some years have combined portions, but we'll use the full 54-week cycle
    if ($weekNumber > 54) {
        $weekNumber = (($weekNumber - 1) % 54) + 1;
    }
    
    return (int)$weekNumber;
}

/**
 * Get information about the current reading cycle
 */
function getCycleInfo() {
    $now = new DateTime();
    $currentYear = (int)$now->format('Y');
    
    $cycleStartMonth = 10;
    $cycleStartDay = 15;
    
    if ($now->format('n') >= $cycleStartMonth || 
        ($now->format('n') == $cycleStartMonth && $now->format('j') >= $cycleStartDay)) {
        $cycleStartYear = $currentYear;
    } else {
        $cycleStartYear = $currentYear - 1;
    }
    
    $cycleStart = new DateTime("$cycleStartYear-$cycleStartMonth-$cycleStartDay");
    $cycleEnd = new DateTime(($cycleStartYear + 1) . "-$cycleStartMonth-$cycleStartDay");
    
    return [
        'cycleStart' => $cycleStart->format('Y-m-d'),
        'cycleEnd' => $cycleEnd->format('Y-m-d'),
        'totalPortions' => 54
    ];
}

/**
 * Get specific Torah portion by ID
 */
function getPortionById($db, $portionId) {
    $stmt = $db->prepare("SELECT * FROM torah_portions WHERE id = ?");
    $stmt->execute([$portionId]);
    $portion = $stmt->fetch();
    
    if (!$portion) {
        throw new Exception('Portion not found');
    }
    
    $portionData = buildPortionData($db, $portion['id']);
    
    echo json_encode([
        'success' => true,
        'data' => $portionData
    ]);
}

/**
 * Get all Torah portions (for navigation/selection)
 */
function getAllPortions($db) {
    $stmt = $db->query("
        SELECT id, name, hebrew, range_text, week_number, book
        FROM torah_portions 
        ORDER BY week_number, id
    ");
    $portions = $stmt->fetchAll();
    
    // Add current portion indicator
    $currentPortionNumber = getCurrentPortionNumber();
    foreach ($portions as &$portion) {
        $portion['isCurrent'] = ($portion['week_number'] == $currentPortionNumber);
    }
    
    echo json_encode([
        'success' => true,
        'data' => $portions,
        'currentWeek' => $currentPortionNumber
    ]);
}

/**
 * Build complete portion data with all related information
 */
function buildPortionData($db, $portionId) {
    // Get base portion
    $stmt = $db->prepare("SELECT * FROM torah_portions WHERE id = ?");
    $stmt->execute([$portionId]);
    $portion = $stmt->fetch();
    
    // Get Torah verses
    $stmt = $db->prepare("
        SELECT reference, verse_text, commentary 
        FROM torah_verses 
        WHERE portion_id = ? 
        ORDER BY display_order
    ");
    $stmt->execute([$portionId]);
    $torahVerses = $stmt->fetchAll();
    
    // Get Haftarah reading
    $stmt = $db->prepare("
        SELECT id, reference 
        FROM haftarah_readings 
        WHERE portion_id = ? 
        LIMIT 1
    ");
    $stmt->execute([$portionId]);
    $haftarahReading = $stmt->fetch();
    
    $haftarahData = null;
    if ($haftarahReading) {
        $stmt = $db->prepare("
            SELECT reference, verse_text, commentary 
            FROM haftarah_verses 
            WHERE haftarah_id = ? 
            ORDER BY display_order
        ");
        $stmt->execute([$haftarahReading['id']]);
        $haftarahVerses = $stmt->fetchAll();
        
        $haftarahData = [
            'reference' => $haftarahReading['reference'],
            'verses' => $haftarahVerses
        ];
    }
    
    // Get New Testament connections
    $stmt = $db->prepare("
        SELECT reference, verse_text, commentary 
        FROM nt_connections 
        WHERE portion_id = ? 
        ORDER BY display_order
    ");
    $stmt->execute([$portionId]);
    $ntConnections = $stmt->fetchAll();
    
    // Get themes
    $stmt = $db->prepare("
        SELECT title, description 
        FROM portion_themes 
        WHERE portion_id = ? 
        ORDER BY display_order
    ");
    $stmt->execute([$portionId]);
    $themes = $stmt->fetchAll();
    
    // Get questions
    $stmt = $db->prepare("
        SELECT question 
        FROM portion_questions 
        WHERE portion_id = ? 
        ORDER BY display_order
    ");
    $stmt->execute([$portionId]);
    $questions = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Build complete response
    return [
        'id' => $portion['id'],
        'name' => $portion['name'],
        'hebrew' => $portion['hebrew'],
        'range' => $portion['range_text'],
        'book' => $portion['book'],
        'summary' => $portion['summary'],
        'teaching' => $portion['teaching'],
        'weekNumber' => $portion['week_number'],
        'keyVerses' => $torahVerses,
        'haftarah' => $haftarahData,
        'newTestament' => ['connections' => $ntConnections],
        'themes' => $themes,
        'questions' => $questions
    ];
}
?>