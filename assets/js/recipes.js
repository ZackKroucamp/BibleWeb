// assets/js/recipes.js

let allRecipes = [];
let filteredRecipes = [];
let filters = {
    periods: [],
    ingredients: [],
    tags: []
};
let currentView = 'grid'; // 'grid' or 'list'
let currentRecipe = null;

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadFilters();
    loadRecipes();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });
    
    // Filter change handlers
    document.getElementById('periodFilter').addEventListener('change', applyFilters);
    document.getElementById('ingredientFilter').addEventListener('change', applyFilters);
    document.getElementById('tagFilter').addEventListener('change', applyFilters);
    document.getElementById('certaintyFilter').addEventListener('change', applyFilters);
    
    // Close modal on outside click
    document.getElementById('recipeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeRecipeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('recipeModal').classList.contains('open')) {
            closeRecipeModal();
        }
    });
}

// Load filter options from API
async function loadFilters() {
    try {
        showStatus('Loading filters...', 'success');
        
        const response = await fetch('/bibleweb/api/recipes/get_filters.php');
        const result = await response.json();
        
        if (result.success) {
            filters = result.data;
            populateFilterDropdowns();
            showStatus('Filters loaded', 'success');
        } else {
            throw new Error(result.error || 'Failed to load filters');
        }
    } catch (error) {
        showStatus('Error loading filters: ' + error.message, 'error');
        console.error('Load filters error:', error);
    }
}

function populateFilterDropdowns() {
    // Populate periods
    const periodSelect = document.getElementById('periodFilter');
    periodSelect.innerHTML = '<option value="">All Periods</option>';
    filters.periods.forEach(period => {
        if (period.recipe_count > 0) {
            const option = document.createElement('option');
            option.value = period.period_slug;
            option.textContent = `${period.period_name} (${period.recipe_count})`;
            periodSelect.appendChild(option);
        }
    });
    
    // Populate ingredients
    const ingredientSelect = document.getElementById('ingredientFilter');
    ingredientSelect.innerHTML = '<option value="">All Ingredients</option>';
    filters.ingredients.forEach(ingredient => {
        if (ingredient.recipe_count > 0) {
            const option = document.createElement('option');
            option.value = ingredient.ingredient_slug;
            option.textContent = `${ingredient.ingredient_name} (${ingredient.recipe_count})`;
            ingredientSelect.appendChild(option);
        }
    });
    
    // Populate tags (grouped by type)
    const tagSelect = document.getElementById('tagFilter');
    tagSelect.innerHTML = '<option value="">All Tags</option>';
    
    const tagsByType = {};
    filters.tags.forEach(tag => {
        if (tag.recipe_count > 0) {
            if (!tagsByType[tag.tag_type]) {
                tagsByType[tag.tag_type] = [];
            }
            tagsByType[tag.tag_type].push(tag);
        }
    });
    
    Object.keys(tagsByType).sort().forEach(type => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = formatTagType(type);
        
        tagsByType[type].forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.tag_slug;
            option.textContent = `${tag.tag_name} (${tag.recipe_count})`;
            optgroup.appendChild(option);
        });
        
        tagSelect.appendChild(optgroup);
    });
}

function formatTagType(type) {
    const types = {
        'feast': '🎉 Feasts',
        'meal_type': '🍽️ Meal Types',
        'dietary': '🥗 Dietary',
        'method': '👨‍🍳 Cooking Methods'
    };
    return types[type] || type;
}

// Load recipes with optional filters
async function loadRecipes(params = {}) {
    try {
        const gridDiv = document.getElementById('recipesGrid');
        gridDiv.innerHTML = '<div class="loading">🍞 Loading recipes...</div>';
        
        const urlParams = new URLSearchParams(params);
        const response = await fetch('/bibleweb/api/recipes/get_recipes.php?' + urlParams);
        const result = await response.json();
        
        if (result.success) {
            allRecipes = result.data;
            filteredRecipes = allRecipes;
            displayRecipes();
            showStatus(`Loaded ${result.data.length} recipes`, 'success');
        } else {
            throw new Error(result.error || 'Failed to load recipes');
        }
    } catch (error) {
        document.getElementById('recipesGrid').innerHTML = 
            `<div class="error-message">❌ Error: ${error.message}</div>`;
        showStatus('Error loading recipes: ' + error.message, 'error');
        console.error('Load recipes error:', error);
    }
}

function searchRecipes() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        filteredRecipes = allRecipes;
        displayRecipes();
        return;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    filteredRecipes = allRecipes.filter(recipe => 
        recipe.recipe_name.toLowerCase().includes(lowerSearch) ||
        (recipe.description && recipe.description.toLowerCase().includes(lowerSearch))
    );
    
    displayRecipes();
    showStatus(`Found ${filteredRecipes.length} recipes`, 'success');
}

function applyFilters() {
    const period = document.getElementById('periodFilter').value;
    const ingredient = document.getElementById('ingredientFilter').value;
    const tag = document.getElementById('tagFilter').value;
    const certainty = document.getElementById('certaintyFilter').value;
    
    const params = {};
    if (period) params.period = period;
    if (ingredient) params.ingredient = ingredient;
    if (tag) params.tag = tag;
    
    // Reload with filters
    loadRecipes(params).then(() => {
        // Apply certainty filter client-side
        if (certainty) {
            filteredRecipes = filteredRecipes.filter(r => r.textual_certainty === certainty);
            displayRecipes();
        }
    });
}

function clearFilters() {
    document.getElementById('periodFilter').value = '';
    document.getElementById('ingredientFilter').value = '';
    document.getElementById('tagFilter').value = '';
    document.getElementById('certaintyFilter').value = '';
    document.getElementById('searchInput').value = '';
    
    loadRecipes();
}

function displayRecipes() {
    const gridDiv = document.getElementById('recipesGrid');
    
    if (filteredRecipes.length === 0) {
        gridDiv.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No Recipes Found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onclick="clearFilters()" class="btn">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    gridDiv.className = currentView === 'grid' ? 'recipes-grid' : 'recipes-list';
    gridDiv.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        gridDiv.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => loadRecipeDetail(recipe.recipe_slug);
    
    const certaintyBadge = getCertaintyBadge(recipe.textual_certainty);
    const timeBadge = getTimeBadge(recipe.prep_time_minutes, recipe.cook_time_minutes);
    const difficultyBadge = getDifficultyBadge(recipe.difficulty);
    
    card.innerHTML = `
        <div class="recipe-card-header">
            <h3 class="recipe-card-title">${escapeHtml(recipe.recipe_name)}</h3>
            <div class="recipe-badges">
                ${certaintyBadge}
                ${recipe.is_feast_related ? '<span class="badge feast">🎉 Feast</span>' : ''}
            </div>
        </div>
        
        <div class="recipe-card-body">
            <p class="recipe-description">${escapeHtml(recipe.description || 'No description available')}</p>
            
            <div class="recipe-meta">
                ${timeBadge}
                ${difficultyBadge}
                ${recipe.servings ? `<span class="meta-item">👥 ${recipe.servings} servings</span>` : ''}
            </div>
        </div>
        
        <div class="recipe-card-footer">
            <button class="btn-link" onclick="event.stopPropagation(); loadRecipeDetail('${recipe.recipe_slug}')">
                <span>View Recipe</span>
                <span class="arrow">→</span>
            </button>
        </div>
    `;
    
    return card;
}

function getCertaintyBadge(certainty) {
    const badges = {
        'explicit': '<span class="badge explicit">📖 Explicit</span>',
        'implicit': '<span class="badge implicit">💭 Implicit</span>',
        'reconstructed': '<span class="badge reconstructed">🏛️ Reconstructed</span>',
        'traditional': '<span class="badge traditional">📜 Traditional</span>'
    };
    return badges[certainty] || '';
}

function getTimeBadge(prep, cook) {
    if (!prep && !cook) return '';
    const total = (prep || 0) + (cook || 0);
    return `<span class="meta-item">⏱️ ${total} min</span>`;
}

function getDifficultyBadge(difficulty) {
    const badges = {
        'easy': '<span class="meta-item difficulty-easy">✓ Easy</span>',
        'medium': '<span class="meta-item difficulty-medium">⚡ Medium</span>',
        'hard': '<span class="meta-item difficulty-hard">🔥 Hard</span>'
    };
    return badges[difficulty] || '';
}

// Load full recipe details
async function loadRecipeDetail(slug) {
    try {
        showStatus('Loading recipe details...', 'success');
        
        const response = await fetch('/bibleweb/api/recipes/get_recipe.php?slug=' + slug);
        const result = await response.json();
        
        if (result.success) {
            currentRecipe = result.data;
            displayRecipeDetail(currentRecipe);
            openRecipeModal();
        } else {
            throw new Error(result.error || 'Failed to load recipe');
        }
    } catch (error) {
        showStatus('Error loading recipe: ' + error.message, 'error');
        console.error('Load recipe detail error:', error);
    }
}

function displayRecipeDetail(recipe) {
    const detailDiv = document.getElementById('recipeDetail');
    
    const certaintyBadge = getCertaintyBadge(recipe.textual_certainty);
    const kosherBadge = recipe.kosher_status === 'kosher' ? 
        '<span class="badge kosher">✡️ Kosher</span>' : '';
    
    let html = `
        <div class="recipe-detail-header">
            <h2>${escapeHtml(recipe.recipe_name)}</h2>
            <div class="recipe-badges-detail">
                ${certaintyBadge}
                ${kosherBadge}
                ${recipe.is_feast_related ? '<span class="badge feast">🎉 Feast Recipe</span>' : ''}
            </div>
        </div>
        
        <div class="recipe-detail-meta">
            ${recipe.prep_time_minutes ? `<div class="meta-detail"><strong>⏲️ Prep:</strong> ${recipe.prep_time_minutes} min</div>` : ''}
            ${recipe.cook_time_minutes ? `<div class="meta-detail"><strong>🔥 Cook:</strong> ${recipe.cook_time_minutes} min</div>` : ''}
            ${recipe.servings ? `<div class="meta-detail"><strong>👥 Servings:</strong> ${recipe.servings}</div>` : ''}
            ${recipe.difficulty ? `<div class="meta-detail"><strong>📊 Difficulty:</strong> ${capitalize(recipe.difficulty)}</div>` : ''}
        </div>
        
        <div class="recipe-section">
            <h3>📖 Description</h3>
            <p>${escapeHtml(recipe.description)}</p>
        </div>
    `;
    
    // Historical Context
    if (recipe.historical_context) {
        html += `
            <div class="recipe-section historical-context">
                <h3>🏛️ Historical Context</h3>
                <p>${escapeHtml(recipe.historical_context)}</p>
            </div>
        `;
    }
    
    // Scripture References
    if (recipe.scripture_refs && recipe.scripture_refs.length > 0) {
        html += `
            <div class="recipe-section scripture-refs">
                <h3>📜 Scripture References</h3>
                <div class="scripture-list">
        `;
        
        recipe.scripture_refs.forEach(ref => {
            const refText = ref.verse_end ? 
                `${ref.book_name} ${ref.chapter}:${ref.verse_start}-${ref.verse_end}` :
                `${ref.book_name} ${ref.chapter}:${ref.verse_start}`;
            
            const refType = ref.reference_type || 'supporting';
            
            html += `
                <div class="scripture-ref ${refType}">
                    <span class="ref-badge ${refType}">${capitalize(refType)}</span>
                    <span class="ref-text">${refText}</span>
                    ${ref.notes ? `<p class="ref-notes">${escapeHtml(ref.notes)}</p>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Historical Periods
    if (recipe.periods && recipe.periods.length > 0) {
        html += `
            <div class="recipe-section periods">
                <h3>📅 Historical Period(s)</h3>
                <div class="period-list">
        `;
        
        recipe.periods.forEach(period => {
            const yearRange = formatYearRange(period.start_year, period.end_year);
            html += `
                <div class="period-item">
                    <strong>${escapeHtml(period.period_name)}</strong>
                    <span class="period-years">${yearRange}</span>
                    ${period.description ? `<p>${escapeHtml(period.description)}</p>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Ingredients
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        html += `
            <div class="recipe-section ingredients">
                <h3>🌾 Ingredients</h3>
                <ul class="ingredient-list">
        `;
        
        recipe.ingredients.forEach(ing => {
            const optional = ing.is_optional ? ' ' : '';
            const prep = ing.preparation_note ? `, ${ing.preparation_note}` : '';
            const hebrew = ing.biblical_name_hebrew ? 
                `<span class="hebrew-name" title="Hebrew">${ing.biblical_name_hebrew}</span>` : '';
            
            html += `
                <li class="ingredient-item">
                    <span class="ingredient-quantity">${escapeHtml(ing.quantity || '')}</span>
                    <span class="ingredient-name">${escapeHtml(ing.ingredient_name)}${prep}${optional}</span>
                    ${hebrew}
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    }
    
    // Instructions
    if (recipe.steps && recipe.steps.length > 0) {
        html += `
            <div class="recipe-section instructions">
                <h3>👨‍🍳 Instructions</h3>
                <ol class="steps-list">
        `;
        
        recipe.steps.forEach(step => {
            html += `
                <li class="step-item">
                    <div class="step-number">${step.step_number}</div>
                    <div class="step-text">${escapeHtml(step.instruction)}</div>
                </li>
            `;
        });
        
        html += `
                </ol>
            </div>
        `;
    }
    
    // Tags
    if (recipe.tags && recipe.tags.length > 0) {
        html += `
            <div class="recipe-section tags">
                <h3>🏷️ Tags</h3>
                <div class="tag-list">
        `;
        
        recipe.tags.forEach(tag => {
            html += `<span class="tag-badge">${escapeHtml(tag.tag_name)}</span>`;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Notes
    if (recipe.notes) {
        html += `
            <div class="recipe-section notes">
                <h3>📝 Notes</h3>
                <p>${escapeHtml(recipe.notes)}</p>
            </div>
        `;
    }
    
    detailDiv.innerHTML = html;
}

function formatYearRange(start, end) {
    if (!start && !end) return '';
    
    const formatYear = (year) => {
        if (!year) return '';
        return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
    };
    
    if (start && end) {
        return `${formatYear(start)} - ${formatYear(end)}`;
    }
    return formatYear(start || end);
}

function openRecipeModal() {
    document.getElementById('recipeModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    document.getElementById('recipeModal').classList.remove('open');
    document.body.style.overflow = '';
    currentRecipe = null;
}

function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    panel.classList.toggle('open');
}

function toggleView() {
    currentView = currentView === 'grid' ? 'list' : 'grid';
    
    const icon = document.getElementById('viewIcon');
    const text = document.getElementById('viewText');
    
    if (currentView === 'grid') {
        icon.textContent = '📋';
        text.textContent = 'Grid';
    } else {
        icon.textContent = '🔲';
        text.textContent = 'List';
    }
    
    displayRecipes();
}

function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export for potential future use
window.recipesModule = {
    loadRecipeDetail,
    searchRecipes,
    applyFilters,
    clearFilters
};