// assets/js/bible-search.js
// Bible Search Module

let searchResults = [];
let searchModal = null;

function initSearch() {
    createSearchModal();
    setupSearchListeners();
}

function createSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content search-modal">
            <span class="close" onclick="closeSearchModal()">&times;</span>
            <h2>Search Bible</h2>
            
            <div class="search-form">
                <div class="search-input-group">
                    <input type="text" id="searchQuery" placeholder="Enter search term..." autocomplete="off">
                    <button class="btn search-btn" onclick="performSearch()">
                        <span class="btn-icon">🔍</span>
                        <span class="btn-text">Search</span>
                    </button>
                </div>
                
                <div class="search-filters">
                    <div class="filter-group">
                        <label>Version:</label>
                        <select id="searchVersion" class="control-select">
                            <!-- Populated dynamically -->
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Book (Optional):</label>
                        <select id="searchBook" class="control-select">
                            <option value="">All Books</option>
                            <!-- Populated dynamically -->
                        </select>
                    </div>
                </div>
            </div>
            
            <div id="searchResults" class="search-results">
                <div class="search-placeholder">
                    Enter a search term to find verses
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    searchModal = modal;
}

function setupSearchListeners() {
    // Enter key to search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.getElementById('searchQuery') === document.activeElement) {
            performSearch();
        }
        
        // Ctrl/Cmd + F to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            openSearchModal();
        }
    });
}

function openSearchModal() {
    const modal = document.getElementById('searchModal');
    if (!modal) {
        initSearch();
        return;
    }
    
    modal.style.display = 'block';
    
    // Populate version dropdown
    const searchVersionSelect = document.getElementById('searchVersion');
    const mainVersionSelect = document.getElementById('versionSelect');
    
    if (searchVersionSelect.options.length === 0 && versions.length > 0) {
        versions.forEach(version => {
            const option = document.createElement('option');
            option.value = version.code;
            option.textContent = version.name !== version.code 
                ? `${version.name} (${version.code})` 
                : version.code;
            searchVersionSelect.appendChild(option);
        });
    }
    
    // Set to current version
    if (currentVersion) {
        searchVersionSelect.value = currentVersion;
    }
    
    // Populate book dropdown
    const searchBookSelect = document.getElementById('searchBook');
    if (searchBookSelect.options.length === 1 && books.length > 0) {
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = book.name;
            searchBookSelect.appendChild(option);
        });
    }
    
    // Focus search input
    document.getElementById('searchQuery').focus();
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function performSearch() {
    const query = document.getElementById('searchQuery').value.trim();
    const version = document.getElementById('searchVersion').value;
    const bookId = document.getElementById('searchBook').value;
    
    if (!query) {
        showStatus('Please enter a search term', 'error');
        return;
    }
    
    if (query.length < 3) {
        showStatus('Search term must be at least 3 characters', 'error');
        return;
    }
    
    if (!version) {
        showStatus('Please select a Bible version', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="loading">🔍 Searching...</div>';
    
    let url = `/bibleweb/api/bible_search.php?action=search&query=${encodeURIComponent(query)}&version=${version}`;
    
    if (bookId) {
        url += `&book_id=${bookId}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                searchResults = result.results;
                displaySearchResults(result);
            } else {
                resultsDiv.innerHTML = `<div class="error-message">❌ ${result.message}</div>`;
            }
        })
        .catch(error => {
            resultsDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
            console.error('Search error:', error);
        });
}

function displaySearchResults(data) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (data.results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <p>No results found for "${data.query}"</p>
                <p>Try different keywords or check spelling</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="results-header">
            <h3>Found ${data.count} result${data.count !== 1 ? 's' : ''} for "${data.query}"</h3>
        </div>
        <div class="results-list">
    `;
    
    data.results.forEach(result => {
        html += `
            <div class="result-item" onclick="loadSearchResult(${result.book_id}, ${result.chapter}, ${result.verse})">
                <div class="result-reference">
                    ${result.book_name} ${result.chapter}:${result.verse}
                </div>
                <div class="result-text">
                    ${result.snippet}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

function loadSearchResult(bookId, chapter, verse) {
    // Close search modal
    closeSearchModal();
    
    // Load the book and chapter
    currentBook = bookId;
    currentChapter = chapter;
    
    // Update UI
    document.getElementById('bookSelect').value = bookId;
    document.getElementById('chapterSelect').value = chapter;
    
    // Load chapter
    loadChapter();
    
    // After chapter loads, scroll to verse
    setTimeout(() => {
        const verseElement = document.querySelector(`[data-verse="${verse}"]`);
        if (verseElement) {
            verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            verseElement.classList.add('highlight-flash');
            
            setTimeout(() => {
                verseElement.classList.remove('highlight-flash');
            }, 2000);
        }
    }, 500);
    
    showStatus(`Loaded ${chapter}:${verse}`);
}

// Initialize search when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}