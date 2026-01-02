<?php
// modules/interlinear.php
include(__DIR__ . '/../includes/header.php');

?>
<script src="/bibleweb/assets/js/interlinear.js" defer></script>
<script src="/bibleweb/assets/js/scripts.js" defer></script>

<link rel="stylesheet" href="/bibleweb/assets/css/styles.css">
<link rel="stylesheet" href="/bibleweb/assets/css/interlinear.css">

<body>
    <div class="header">
        <h1>📜 Interlinear Bible</h1>
        <div class="header-toolbar">
            <button class="tool-btn" id="displayModeBtn" onclick="toggleDisplayMode()" title="Toggle display mode">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">Interlinear</span>
            </button>
            
            <button class="tool-btn" onclick="toggleInfoPanel()" title="Word information">
                <span class="btn-icon">ℹ️</span>
                <span class="btn-text">Info</span>
            </button>
            
            <button class="tool-btn" onclick="toggleSettings()" title="Display settings">
                <span class="btn-icon">⚙️</span>
                <span class="btn-text">Settings</span>
            </button>
        </div>
    </div>

    <div class="interlinear-controls">
        <div class="control-group">
            <label for="testamentSelect">Testament:</label>
            <select id="testamentSelect" class="control-select">
                <option value="">Select Testament</option>
                <option value="OT">Old Testament (Hebrew)</option>
                <option value="NT">New Testament (Greek)</option>
            </select>
        </div>

        <div class="control-group">
            <label for="bookSelect">Book:</label>
            <select id="bookSelect" class="control-select" disabled>
                <option value="">Select a testament first</option>
            </select>
        </div>

        <div class="control-group">
            <label for="chapterSelect">Chapter:</label>
            <select id="chapterSelect" class="control-select" disabled>
                <option value="">Select a book first</option>
            </select>
        </div>

        <button id="loadButton" class="btn load-btn">
            <span class="btn-icon">📖</span>
            <span class="btn-text">Load Chapter</span>
        </button>
    </div>

    <!-- Settings Panel -->
    <div id="settingsPanel" class="settings-panel">
        <div class="settings-content">
            <h3>Display Settings</h3>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="showTransliteration" checked>
                    Show Transliteration
                </label>
            </div>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="showStrongs" checked>
                    Show Strong's Numbers
                </label>
            </div>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="showMorphology" checked>
                    Show Morphology
                </label>
            </div>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="showGloss" checked>
                    Show Gloss
                </label>
            </div>
            
            <div class="setting-item">
                <label for="fontSize">Font Size:</label>
                <input type="range" id="fontSize" min="12" max="24" value="16">
                <span id="fontSizeValue">16px</span>
            </div>
        </div>
    </div>

    <div class="interlinear-container">
        <div class="chapter-navigation">
            <button class="nav-btn nav-prev" onclick="loadPreviousChapter()" disabled title="Previous Chapter">
                <span class="nav-icon">←</span>
                <span class="nav-text">Previous</span>
            </button>
            
            <div class="content-wrapper">
                <div id="interlinearContent" class="interlinear-content">
                    <div class="welcome-message">
                        <h2>📜 Welcome to Interlinear Bible</h2>
                        <p>Study the original Hebrew and Greek texts word-by-word with English translations.</p>
                        <div class="welcome-features">
                            <div class="feature">
                                <span class="feature-icon">🔤</span>
                                <span>Original Language</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">🔊</span>
                                <span>Transliteration</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">📚</span>
                                <span>Strong's Numbers</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">📖</span>
                                <span>English Gloss</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Word Info Panel -->
                <div id="infoPanel" class="info-panel">
                    <div class="info-header">
                        <h3>Word Information</h3>
                        <button class="close-btn" onclick="toggleInfoPanel()">✕</button>
                    </div>
                    <div id="wordInfo" class="word-info-content">
                        <p class="info-placeholder">Click on any word to see detailed information</p>
                    </div>
                </div>
            </div>
            
            <button class="nav-btn nav-next" onclick="loadNextChapter()" disabled title="Next Chapter">
                <span class="nav-text">Next</span>
                <span class="nav-icon">→</span>
            </button>
        </div>
    </div>

    <div id="statusMessage" class="status-message"></div>
    
    <?php include(__DIR__ . '/../includes/footer.php'); ?>
</body>