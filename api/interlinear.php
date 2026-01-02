<?php
// api/interlinear.php
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$dbFile = __DIR__ . '/../sqlite/Interlinear.db';

try {
    if (!file_exists($dbFile)) {
        throw new Exception('Interlinear database not found');
    }
    
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    switch ($action) {
        case 'get_books':
            $testament = $_GET['testament'] ?? '';
            
            if (!$testament || !in_array($testament, ['OT', 'NT'])) {
                throw new Exception('Valid testament is required (OT or NT)');
            }
            
            // Get distinct books for the testament with chapter counts
            $stmt = $pdo->prepare("
                SELECT DISTINCT 
                    b.book_id,
                    b.book_name,
                    b.book_abbreviation,
                    b.testament,
                    MAX(v.chapter) as max_chapter
                FROM books b
                INNER JOIN verses v ON b.book_id = v.book_id
                WHERE b.testament = ?
                GROUP BY b.book_id, b.book_name, b.book_abbreviation, b.testament
                ORDER BY b.book_id
            ");
            $stmt->execute([$testament]);
            $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($books)) {
                throw new Exception('No books found for ' . $testament);
            }
            
            echo json_encode([
                'success' => true, 
                'books' => $books,
                'testament' => $testament
            ]);
            break;

        case 'get_chapter':
            $testament = $_GET['testament'] ?? '';
            $book = $_GET['book'] ?? '';
            $chapter = $_GET['chapter'] ?? 0;

            if (!$testament || !$book || !$chapter) {
                throw new Exception('Testament, book, and chapter are required');
            }
            
            // Get book info
            $stmt = $pdo->prepare("
                SELECT book_id, book_name, testament 
                FROM books 
                WHERE book_abbreviation = ? AND testament = ?
            ");
            $stmt->execute([$book, $testament]);
            $bookInfo = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$bookInfo) {
                throw new Exception('Book not found');
            }
            
            // Get all verses for this chapter
            $stmt = $pdo->prepare("
                SELECT verse_id, verse 
                FROM verses 
                WHERE book_id = ? AND chapter = ?
                ORDER BY verse
            ");
            $stmt->execute([$bookInfo['book_id'], $chapter]);
            $verses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($verses)) {
                throw new Exception('No verses found for this chapter');
            }
            
            // Get all words for these verses
            $verseIds = array_column($verses, 'verse_id');
            $placeholders = str_repeat('?,', count($verseIds) - 1) . '?';
            
            $stmt = $pdo->prepare("
                SELECT 
                    word_id,
                    verse_id,
                    word_position,
                    original_text,
                    transliteration,
                    strongs_number,
                    morphology,
                    gloss,
                    english_word,
                    language
                FROM words 
                WHERE verse_id IN ($placeholders)
                ORDER BY verse_id, word_position
            ");
            $stmt->execute($verseIds);
            $allWords = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Group words by verse
            $wordsByVerse = [];
            foreach ($allWords as $word) {
                $wordsByVerse[$word['verse_id']][] = $word;
            }
            
            // Build response with verses and their words
            $versesData = [];
            foreach ($verses as $verse) {
                $versesData[] = [
                    'verse' => $verse['verse'],
                    'verse_id' => $verse['verse_id'],
                    'words' => $wordsByVerse[$verse['verse_id']] ?? []
                ];
            }
            
            // Determine language from first word
            $language = !empty($allWords) ? $allWords[0]['language'] : 'Unknown';
            
            echo json_encode([
                'success' => true,
                'book_name' => $bookInfo['book_name'],
                'chapter' => $chapter,
                'testament' => $testament,
                'language' => $language,
                'verses' => $versesData,
                'total_words' => count($allWords)
            ]);
            break;

        case 'search_strongs':
            $strongsNumber = $_GET['strongs'] ?? '';
            $testament = $_GET['testament'] ?? '';
            
            if (!$strongsNumber) {
                throw new Exception('Strong\'s number is required');
            }
            
            // Build query
            $query = "
                SELECT 
                    w.word_id,
                    w.original_text,
                    w.transliteration,
                    w.gloss,
                    b.book_name,
                    v.chapter,
                    v.verse
                FROM words w
                INNER JOIN verses v ON w.verse_id = v.verse_id
                INNER JOIN books b ON v.book_id = b.book_id
                WHERE w.strongs_number = ?
            ";
            
            $params = [$strongsNumber];
            
            if ($testament) {
                $query .= " AND b.testament = ?";
                $params[] = $testament;
            }
            
            $query .= " ORDER BY b.book_id, v.chapter, v.verse, w.word_position LIMIT 100";
            
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'strongs' => $strongsNumber,
                'count' => count($results),
                'results' => $results
            ]);
            break;

        case 'get_word_details':
            $wordId = $_GET['word_id'] ?? 0;
            
            if (!$wordId) {
                throw new Exception('Word ID is required');
            }
            
            $stmt = $pdo->prepare("
                SELECT 
                    w.*,
                    b.book_name,
                    v.chapter,
                    v.verse
                FROM words w
                INNER JOIN verses v ON w.verse_id = v.verse_id
                INNER JOIN books b ON v.book_id = b.book_id
                WHERE w.word_id = ?
            ");
            $stmt->execute([$wordId]);
            $word = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$word) {
                throw new Exception('Word not found');
            }
            
            // Get count of occurrences for this Strong's number
            if ($word['strongs_number']) {
                $stmt = $pdo->prepare("
                    SELECT COUNT(*) as count 
                    FROM words 
                    WHERE strongs_number = ?
                ");
                $stmt->execute([$word['strongs_number']]);
                $occurrences = $stmt->fetchColumn();
                $word['total_occurrences'] = $occurrences;
            }
            
            echo json_encode([
                'success' => true,
                'word' => $word
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