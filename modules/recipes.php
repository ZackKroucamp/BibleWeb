<?php
// modules/recipes.php
include(__DIR__ . '/../includes/header.php');
?>
<script src="/bibleweb/assets/js/recipes.js" defer></script>
<script src="/bibleweb/assets/js/scripts.js" defer></script>

<link rel="stylesheet" href="/bibleweb/assets/css/styles.css">
<link rel="stylesheet" href="/bibleweb/assets/css/recipes.css">

<body>
    <div class="header">
        <h1>🍞 Biblical Recipes</h1>
        <div class="header-toolbar">
            <button class="tool-btn" onclick="toggleFilters()" title="Show filters">
                <span class="btn-icon">🔍</span>
                <span class="btn-text">Filters</span>
            </button>
            
            <button class="tool-btn" onclick="toggleView()" title="Toggle view">
                <span class="btn-icon" id="viewIcon">📋</span>
                <span class="btn-text" id="viewText">Grid</span>
            </button>
        </div>
    </div>

    <div class="recipes-controls">
        <div class="search-bar">
            <input type="text" 
                   id="searchInput" 
                   class="search-input" 
                   placeholder="Search recipes..."
                   autocomplete="off">
            <button onclick="searchRecipes()" class="btn search-btn">
                <span class="btn-icon">🔍</span>
                <span class="btn-text">Search</span>
            </button>
        </div>
    </div>

    <!-- Filters Panel -->
    <div id="filtersPanel" class="filters-panel">
        <div class="filters-content">
            <h3>Filter Recipes</h3>
            
            <div class="filter-group">
                <h4>📅 Historical Period</h4>
                <select id="periodFilter" class="filter-select">
                    <option value="">All Periods</option>
                </select>
            </div>
            
            <div class="filter-group">
                <h4>🌾 Ingredient</h4>
                <select id="ingredientFilter" class="filter-select">
                    <option value="">All Ingredients</option>
                </select>
            </div>
            
            <div class="filter-group">
                <h4>🏷️ Tags</h4>
                <select id="tagFilter" class="filter-select">
                    <option value="">All Tags</option>
                </select>
            </div>
            
            <div class="filter-group">
                <h4>📖 Textual Certainty</h4>
                <select id="certaintyFilter" class="filter-select">
                    <option value="">All Types</option>
                    <option value="explicit">Explicit (Clear Scripture)</option>
                    <option value="implicit">Implicit (Implied)</option>
                    <option value="reconstructed">Historical Reconstruction</option>
                    <option value="traditional">Later Tradition</option>
                </select>
            </div>
            
            <div class="filter-actions">
                <button onclick="applyFilters()" class="btn apply-btn">Apply Filters</button>
                <button onclick="clearFilters()" class="btn clear-btn">Clear All</button>
            </div>
        </div>
    </div>

    <div class="recipes-container">
        <div id="recipesGrid" class="recipes-grid">
            <div class="welcome-message">
                <h2>🍞 Welcome to Biblical Recipes</h2>
                <p>Explore authentic recipes rooted in Scripture and ancient Near Eastern history.</p>
                <div class="certainty-legend">
                    <h3>Understanding Recipe Certainty:</h3>
                    <div class="legend-items">
                        <div class="legend-item">
                            <span class="badge explicit">Explicit</span>
                            <p>Directly described in Scripture with clear instructions</p>
                        </div>
                        <div class="legend-item">
                            <span class="badge implicit">Implicit</span>
                            <p>Ingredients/methods implied from biblical context</p>
                        </div>
                        <div class="legend-item">
                            <span class="badge reconstructed">Reconstructed</span>
                            <p>Based on archaeological and historical evidence</p>
                        </div>
                        <div class="legend-item">
                            <span class="badge traditional">Traditional</span>
                            <p>Later Jewish or Christian culinary tradition</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Recipe Detail Modal -->
        <div id="recipeModal" class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeRecipeModal()">✕</button>
                <div id="recipeDetail"></div>
            </div>
        </div>
    </div>

    <div id="statusMessage" class="status-message"></div>
    
    <?php include(__DIR__ . '/../includes/footer.php'); ?>
</body>