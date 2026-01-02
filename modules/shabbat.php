<?php
// modules/shabbat.php
// require_once(__DIR__ . '/../includes/auth.php');
include(__DIR__ . '/../includes/header.php');
?>

<script src="/bibleweb/assets/js/shabbat.js" defer></script>
<script src="/bibleweb/assets/js/scripts.js" defer></script>

<link rel="stylesheet" href="/bibleweb/assets/css/styles.css">
<link rel="stylesheet" href="/bibleweb/assets/css/shabbat.css">

<body>
    <div class="header">
        <h1>Shabbat Study</h1>
        <div class="header-toolbar">
            <button class="tool-btn" onclick="refreshShabbatTimes()" title="Refresh Shabbat Times">
                <span class="btn-icon">↻</span>
                <span class="btn-text">Refresh</span>
            </button>
            
            <button class="tool-btn" onclick="printPortion()" title="Print Torah Portion">
                <span class="btn-icon">⎙</span>
                <span class="btn-text">Print</span>
            </button>
            
            <button class="tool-btn" onclick="shareShabbat()" title="Share">
                <span class="btn-icon">↗</span>
                <span class="btn-text">Share</span>
            </button>
        </div>
    </div>

    <div class="shabbat-container">
        <!-- Shabbat Times Card -->
        <div class="shabbat-times-section">
            <div class="shabbat-times-card" id="shabbat-times-card">
                <div class="loading-spinner" id="times-loading">
                    <div class="spinner"></div>
                    <p>Fetching Shabbat times for your location...</p>
                </div>
                
                <div class="times-content" id="times-content" style="display: none;">
                    <div class="times-header">
                        <h2 class="shabbat-greeting">
                            <span class="greeting-hebrew">שבת שלום</span>
                            <span class="greeting-english">Shabbat Shalom</span>
                        </h2>
                        
                        <div class="location-info">
                            <span class="location-icon">•</span>
                            <span id="location-name">Loading...</span>
                        </div>
                    </div>
                    
                    <div class="times-grid">
                        <div class="time-item candle-lighting">
                            <div class="time-label">Candle Lighting</div>
                            <div class="time-value" id="candle-time">--:--</div>
                            <div class="time-date" id="candle-date">--</div>
                        </div>
                        
                        <div class="time-item havdalah">
                            <div class="time-label">Havdalah</div>
                            <div class="time-value" id="havdalah-time">--:--</div>
                            <div class="time-date" id="havdalah-date">--</div>
                        </div>
                    </div>
                    
                    <div class="parasha-banner">
                        <span class="parasha-label">This Week's Portion</span>
                        <span class="parasha-name" id="current-parasha-name">Loading...</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Torah Portion Content -->
        <div class="portion-wrapper">
            <div class="portion-header-card">
                <div class="portion-loading" id="portion-loading">
                    <div class="spinner"></div>
                    <p>Loading Torah portion...</p>
                </div>

                <div id="portion-header-content" style="display: none;">
                    <h2 id="portion-title">Weekly Torah Portion</h2>
                    <div class="portion-meta">
                        <span class="portion-hebrew" id="portion-hebrew"></span>
                        <span class="portion-divider">•</span>
                        <span class="portion-range" id="portion-range"></span>
                    </div>
                </div>
            </div>

            <div id="portion-body" style="display: none;">
                <!-- Summary Section -->
                <div class="portion-section summary-section">
                    <div class="section-header">
                        <h3>Torah Portion Summary</h3>
                    </div>
                    <div class="section-content">
                        <div class="summary-text" id="summary-content"></div>
                    </div>
                </div>

                <!-- Key Verses Section -->
                <div class="portion-section verses-section">
                    <div class="section-header">
                        <h3>Key Verses from Torah</h3>
                    </div>
                    <div class="section-content">
                        <div id="verses-container"></div>
                    </div>
                </div>

                <!-- Haftarah Section -->
                <div class="portion-section haftarah-section">
                    <div class="section-header">
                        <h3>Haftarah (Prophets)</h3>
                    </div>
                    <div class="section-content">
                        <div class="haftarah-reference" id="haftarah-reference"></div>
                        <div id="haftarah-container"></div>
                    </div>
                </div>

                <!-- New Testament Connection -->
                <div class="portion-section nt-section">
                    <div class="section-header">
                        <h3>New Testament Connection</h3>
                    </div>
                    <div class="section-content">
                        <div id="nt-container"></div>
                    </div>
                </div>

                <!-- Teaching Section -->
                <div class="portion-section teaching-section">
                    <div class="section-header">
                        <h3>Teaching & Reflection</h3>
                    </div>
                    <div class="section-content">
                        <div class="teaching-text" id="teaching-content"></div>
                    </div>
                </div>

                <!-- Themes Section -->
                <div class="portion-section themes-section">
                    <div class="section-header">
                        <h3>Key Themes</h3>
                    </div>
                    <div class="section-content">
                        <div class="themes-grid" id="themes-grid"></div>
                    </div>
                </div>

                <!-- Discussion Questions -->
                <div class="portion-section questions-section">
                    <div class="section-header">
                        <h3>Questions for Reflection</h3>
                    </div>
                    <div class="section-content">
                        <div class="questions-list" id="questions-list"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="statusMessage" class="status-message"></div>

    <?php include(__DIR__ . '/../includes/footer.php'); ?>
</body>