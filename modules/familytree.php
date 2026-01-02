<?php
// require_once(__DIR__ . '/../includes/auth.php');
include(__DIR__ . '/../includes/header.php');
?>
<script src="/bibleweb/assets/js/familytree.js" defer></script>
<script src="/bibleweb/assets/js/scripts.js" defer></script>

<link rel="stylesheet" href="/bibleweb/assets/css/styles.css">
<link rel="stylesheet" href="/bibleweb/assets/css/familytree.css">

<body>
    <div class="header">
        <h1>📜 Biblical Family Tree</h1>
        <div class="controls">
            <button class="btn" onclick="addCharacter()">
                <span class="btn-icon">➕</span>
                <span class="btn-text">Add Character</span>
            </button>
            <button class="btn" onclick="autoLayout()">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">Auto Layout</span>
            </button>
            <button class="btn" onclick="saveTree()">
                <span class="btn-icon">💾</span>
                <span class="btn-text">Save</span>
            </button>
            <button class="btn" onclick="loadTree()">
                <span class="btn-icon">📂</span>
                <span class="btn-text">Load</span>
            </button>
            <button class="btn" onclick="clearTree()">
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">Clear</span>
            </button>
        </div>
    </div>

    <div class="relationship-controls">
        <div class="mode-label">Relationship Mode:</div>
        <button class="relationship-btn active" onclick="setRelationshipMode('none')">
            <span>✋</span> Move
        </button>
        <button class="relationship-btn" onclick="setRelationshipMode('marriage')">
            <span>💒</span> Marriage
        </button>
        <button class="relationship-btn" onclick="setRelationshipMode('concubine')">
            <span>💫</span> Concubine
        </button>
        <button class="relationship-btn" onclick="setRelationshipMode('child')">
            <span>👶</span> Parent-Child
        </button>
    </div>

    <div class="canvas-container" id="canvasContainer">
        <div class="canvas" id="canvas">
            <svg id="connectionSvg" xmlns="http://www.w3.org/2000/svg"></svg>
        </div>
    </div>

    <div class="zoom-controls">
        <button class="zoom-btn" onclick="zoomIn()" title="Zoom In">+</button>
        <button class="zoom-btn" onclick="resetView()" title="Reset View">⟲</button>
        <button class="zoom-btn" onclick="zoomOut()" title="Zoom Out">−</button>
    </div>

    <div class="legend">
        <div class="legend-title">Legend</div>
        <div class="legend-item">
            <div class="legend-line marriage-line"></div>
            <span>Marriage</span>
        </div>
        <div class="legend-item">
            <div class="legend-line concubine-line"></div>
            <span>Concubine</span>
        </div>
        <div class="legend-item">
            <div class="legend-line child-line"></div>
            <span>Parent-Child</span>
        </div>
    </div>

    <div class="minimap" id="minimap">
        <canvas id="minimapCanvas" width="200" height="120"></canvas>
    </div>

    <div id="characterModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle">Add Character</h2>
            <form id="characterForm" onsubmit="saveCharacter(event)">
                <div class="form-group">
                    <label for="characterName">Name:</label>
                    <input type="text" id="characterName" required placeholder="Enter character name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="characterAge">Age:</label>
                        <input type="number" id="characterAge" min="0" max="1000" placeholder="Age">
                    </div>
                    <div class="form-group">
                        <label for="characterSex">Sex:</label>
                        <select id="characterSex" required>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="characterDescription">Description:</label>
                    <textarea id="characterDescription" placeholder="Brief description or biblical reference..." rows="4"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="close-btn" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="submit-btn">Save Character</button>
                </div>
            </form>
        </div>
    </div>

    <div id="statusMessage" class="status-message"></div>
    <?php include(__DIR__ . '/../includes/footer.php'); ?>
</body>