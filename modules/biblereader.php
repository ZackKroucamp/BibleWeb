<?php
// require_once(__DIR__ . '/../includes/auth.php');
include(__DIR__ . '/../includes/header.php');
?>
<script src="/bibleweb/assets/js/biblereader.js" defer></script>
<script src="/bibleweb/assets/js/bible-search.js" defer></script>
<script src="/bibleweb/assets/js/bible-highlights.js" defer></script>
<script src="/bibleweb/assets/js/bible-preferences.js" defer></script>
<script src="/bibleweb/assets/js/scripts.js" defer></script>

<link rel="stylesheet" href="/bibleweb/assets/css/styles.css">
<link rel="stylesheet" href="/bibleweb/assets/css/biblereader.css">
<link rel="stylesheet" href="/bibleweb/assets/css/biblereader-extended.css">

<body>
    <div class="header">
        <h1>📖 Bible Reader</h1>
        <div class="header-toolbar">
            <button class="tool-btn" onclick="openSearchModal()" title="Search Bible (Ctrl+F)">
                <span class="btn-icon">🔍</span>
                <span class="btn-text">Search</span>
            </button>
            
            <button class="tool-btn" id="highlightBtn" onclick="toggleHighlightMode()" title="Highlight verses">
                <span class="btn-icon">🎨</span>
                <span class="btn-text">Highlight</span>
            </button>
            
            <button class="tool-btn" onclick="openPreferences()" title="Settings">
                <span class="btn-icon">⚙️</span>
                <span class="btn-text">Settings</span>
            </button>
        </div>
    </div>

    <div class="bible-controls">
        <div class="control-group">
            <label for="versionSelect">Version:</label>
            <select id="versionSelect" class="control-select">
                <option value="">Loading...</option>
            </select>
        </div>

        <div class="control-group">
            <label for="bookSelect">Book:</label>
            <select id="bookSelect" class="control-select">
                <option value="">Select a version first</option>
            </select>
        </div>

        <div class="control-group">
            <label for="chapterSelect">Chapter:</label>
            <select id="chapterSelect" class="control-select">
                <option value="">Select a book first</option>
            </select>
        </div>

        <button id="loadButton" class="btn load-btn">
            <span class="btn-icon">📖</span>
            <span class="btn-text">Load Chapter</span>
        </button>
    </div>

    <div class="bible-container">
        <div class="chapter-navigation">
            <button class="nav-btn nav-prev" onclick="loadPreviousChapter()" title="Previous Chapter">
                <span class="nav-text">Previous</span>
                <span class="nav-icon">←</span>
            </button>
            
            <div id="bibleContent" class="bible-content">
                <div class="welcome-message">
                    <h2>Welcome to Bible Reader</h2>
                    <p>Select a version, book, and chapter to begin reading.</p>
                </div>
            </div>
            
            <button class="nav-btn nav-next" onclick="loadNextChapter()" title="Next Chapter">
                <span class="nav-text">Next</span>
                <span class="nav-icon">→</span>
            </button>
        </div>
    </div>

    <div id="statusMessage" class="status-message"></div>
    <?php include(__DIR__ . '/../includes/footer.php'); ?>
</body>