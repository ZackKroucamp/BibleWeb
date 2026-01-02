// assets/js/interlinear.js

let books = [];
let currentTestament = null;
let currentBook = null;
let currentChapter = null;
let displayMode = 'interlinear'; // 'interlinear', 'side-by-side', 'line-view'
let selectedWord = null;

// Display settings
let settings = {
    showTransliteration: true,
    showStrongs: true,
    showMorphology: true,
    showGloss: true,
    fontSize: 16
};

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSettings();
});

function setupEventListeners() {
    document.getElementById('testamentSelect').addEventListener('change', handleTestamentChange);
    document.getElementById('bookSelect').addEventListener('change', handleBookChange);
    document.getElementById('chapterSelect').addEventListener('change', handleChapterChange);
    document.getElementById('loadButton').addEventListener('click', loadChapter);
    
    // Settings
    document.getElementById('showTransliteration').addEventListener('change', updateSettings);
    document.getElementById('showStrongs').addEventListener('change', updateSettings);
    document.getElementById('showMorphology').addEventListener('change', updateSettings);
    document.getElementById('showGloss').addEventListener('change', updateSettings);
    document.getElementById('fontSize').addEventListener('input', updateFontSize);
    
    // Enter key to load
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && currentTestament && currentBook && currentChapter) {
            loadChapter();
        }
    });
}

function loadSettings() {
    // Apply saved settings if any
    const saved = localStorage.getItem('interlinearSettings');
    if (saved) {
        settings = JSON.parse(saved);
        document.getElementById('showTransliteration').checked = settings.showTransliteration;
        document.getElementById('showStrongs').checked = settings.showStrongs;
        document.getElementById('showMorphology').checked = settings.showMorphology;
        document.getElementById('showGloss').checked = settings.showGloss;
        document.getElementById('fontSize').value = settings.fontSize;
        updateFontSize();
    }
}

function saveSettings() {
    localStorage.setItem('interlinearSettings', JSON.stringify(settings));
}

function updateSettings(e) {
    const setting = e.target.id;
    settings[setting] = e.target.checked;
    saveSettings();
    
    // Re-render if content is loaded
    if (document.querySelector('.verses-container')) {
        applyDisplaySettings();
    }
}

function updateFontSize() {
    const value = document.getElementById('fontSize').value;
    settings.fontSize = parseInt(value);
    document.getElementById('fontSizeValue').textContent = value + 'px';
    document.documentElement.style.setProperty('--base-font-size', value + 'px');
    saveSettings();
}

function applyDisplaySettings() {
    const container = document.querySelector('.verses-container');
    if (!container) return;
    
    container.querySelectorAll('.transliteration').forEach(el => {
        el.style.display = settings.showTransliteration ? 'block' : 'none';
    });
    
    container.querySelectorAll('.strongs-number').forEach(el => {
        el.style.display = settings.showStrongs ? 'block' : 'none';
    });
    
    container.querySelectorAll('.morphology').forEach(el => {
        el.style.display = settings.showMorphology ? 'block' : 'none';
    });
    
    container.querySelectorAll('.gloss').forEach(el => {
        el.style.display = settings.showGloss ? 'block' : 'none';
    });
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('open');
}

function toggleInfoPanel() {
    const panel = document.getElementById('infoPanel');
    const wrapper = document.querySelector('.content-wrapper');
    
    if (window.innerWidth <= 1200) {
        // Mobile: slide in from right
        panel.classList.toggle('open');
    } else {
        // Desktop: toggle grid column
        panel.classList.toggle('hidden');
        wrapper.classList.toggle('info-hidden');
    }
}

function toggleDisplayMode() {
    const modes = ['interlinear', 'side-by-side', 'line-view'];
    const currentIndex = modes.indexOf(displayMode);
    displayMode = modes[(currentIndex + 1) % modes.length];
    
    const btn = document.getElementById('displayModeBtn');
    const modeNames = {
        'interlinear': 'Interlinear',
        'side-by-side': 'Side-by-Side',
        'line-view': 'Line View'
    };
    
    btn.querySelector('.btn-text').textContent = modeNames[displayMode];
    
    // Re-render with new mode
    if (document.querySelector('.verses-container')) {
        const grids = document.querySelectorAll('.words-grid');
        grids.forEach(grid => {
            grid.className = 'words-grid ' + displayMode;
        });
    }
}

function handleTestamentChange(e) {
    currentTestament = e.target.value;
    currentBook = null;
    currentChapter = null;
    
    const bookSelect = document.getElementById('bookSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    
    if (currentTestament) {
        bookSelect.innerHTML = '<option value="">Loading books...</option>';
        bookSelect.disabled = true;
        chapterSelect.innerHTML = '<option value="">Select a book first</option>';
        chapterSelect.disabled = true;
        
        loadBooks(currentTestament);
    } else {
        bookSelect.innerHTML = '<option value="">Select a testament first</option>';
        bookSelect.disabled = true;
        chapterSelect.innerHTML = '<option value="">Select a book first</option>';
        chapterSelect.disabled = true;
    }
    
    updateNavigationButtons();
}

function loadBooks(testament) {
    showStatus('Loading books...', 'success');
    
    fetch(`/bibleweb/api/interlinear.php?action=get_books&testament=${testament}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                books = result.books;
                populateBookSelect();
                showStatus(`Loaded ${books.length} books`, 'success');
            } else {
                showStatus('Error loading books: ' + result.message, 'error');
                document.getElementById('bookSelect').innerHTML = '<option value="">Error loading books</option>';
            }
        })
        .catch(error => {
            showStatus('Error: ' + error.message, 'error');
            console.error('Load books error:', error);
        });
}

function populateBookSelect() {
    const select = document.getElementById('bookSelect');
    select.innerHTML = '<option value="">Select a book</option>';
    
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.book_abbreviation;
        option.dataset.chapters = book.max_chapter;
        option.textContent = book.book_name;
        select.appendChild(option);
    });
    
    select.disabled = false;
}

function handleBookChange(e) {
    currentBook = e.target.value;
    currentChapter = null;
    
    const chapterSelect = document.getElementById('chapterSelect');
    
    if (currentBook) {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const chaptersCount = parseInt(selectedOption.dataset.chapters);
        populateChapterSelect(chaptersCount);
    } else {
        chapterSelect.innerHTML = '<option value="">Select a book first</option>';
        chapterSelect.disabled = true;
    }
    
    updateNavigationButtons();
}

function populateChapterSelect(chaptersCount) {
    const select = document.getElementById('chapterSelect');
    select.innerHTML = '<option value="">Select a chapter</option>';
    
    for (let i = 1; i <= chaptersCount; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Chapter ${i}`;
        select.appendChild(option);
    }
    
    select.disabled = false;
    
    if (chaptersCount > 0) {
        select.value = '1';
        currentChapter = '1';
    }
    
    updateNavigationButtons();
}

function handleChapterChange(e) {
    currentChapter = e.target.value;
    updateNavigationButtons();
}

function loadChapter() {
    if (!currentTestament || !currentBook || !currentChapter) {
        showStatus('Please select testament, book, and chapter', 'error');
        return;
    }
    
    const contentDiv = document.getElementById('interlinearContent');
    contentDiv.innerHTML = '<div class="loading">📜 Loading interlinear text...</div>';
    
    const url = `/bibleweb/api/interlinear.php?action=get_chapter&testament=${currentTestament}&book=${currentBook}&chapter=${currentChapter}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayInterlinear(result);
                showStatus(`Loaded ${result.book_name} ${result.chapter}`, 'success');
                updateNavigationButtons();
            } else {
                contentDiv.innerHTML = `<div class="error-message">❌ Error: ${result.message}</div>`;
                showStatus('Error loading chapter: ' + result.message, 'error');
            }
        })
        .catch(error => {
            contentDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
            showStatus('Error: ' + error.message, 'error');
            console.error('Load chapter error:', error);
        });
}

function displayInterlinear(data) {
    const contentDiv = document.getElementById('interlinearContent');
    const isHebrew = data.language === 'Hebrew';
    
    let html = `
        <div class="chapter-header">
            <div class="language-badge">${data.language} ${data.testament}</div>
            <h2>${data.book_name} ${data.chapter}</h2>
            <div class="verse-count">${data.verses.length} verses • ${data.total_words} words</div>
        </div>
        <div class="verses-container">
    `;
    
    data.verses.forEach(verse => {
        html += `
            <div class="verse-block">
                <div class="verse-header">
                    <div class="verse-number-badge">${verse.verse}</div>
                </div>
                <div class="words-grid ${displayMode} ${isHebrew ? 'hebrew' : 'greek'}">
        `;
        
        verse.words.forEach(word => {
            html += createWordUnit(word);
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    contentDiv.innerHTML = html;
    
    // Apply settings
    applyDisplaySettings();
    
    // Add click handlers to words
    document.querySelectorAll('.word-unit').forEach(wordEl => {
        wordEl.addEventListener('click', () => handleWordClick(wordEl));
    });
    
    contentDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createWordUnit(word) {
    return `
        <div class="word-unit" 
             data-word-id="${word.word_id}"
             data-strongs="${word.strongs_number}"
             data-morph="${word.morphology}">
            <div class="original-text">${word.original_text}</div>
            <div class="transliteration">${word.transliteration || ''}</div>
            <div class="strongs-number">${word.strongs_number || ''}</div>
            <div class="morphology">${word.morphology || ''}</div>
            <div class="gloss">${word.gloss || ''}</div>
            <div class="english-word">${word.english_word || word.gloss || ''}</div>
        </div>
    `;
}

function handleWordClick(wordEl) {
    // Remove previous selection
    document.querySelectorAll('.word-unit.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Mark as selected
    wordEl.classList.add('selected');
    
    // Extract word data
    const wordData = {
        original: wordEl.querySelector('.original-text').textContent,
        transliteration: wordEl.querySelector('.transliteration').textContent,
        strongs: wordEl.querySelector('.strongs-number').textContent,
        morphology: wordEl.querySelector('.morphology').textContent,
        gloss: wordEl.querySelector('.gloss').textContent,
        english: wordEl.querySelector('.english-word').textContent
    };
    
    displayWordInfo(wordData);
    
    // Show info panel on mobile
    if (window.innerWidth <= 1200) {
        document.getElementById('infoPanel').classList.add('open');
    }
}

function displayWordInfo(word) {
    const infoDiv = document.getElementById('wordInfo');
    
    let html = `
        <div class="info-section">
            <div class="info-label">Original Text</div>
            <div class="info-value large">${word.original}</div>
        </div>
        
        <div class="info-section">
            <div class="info-label">Transliteration</div>
            <div class="info-value">${word.transliteration || 'N/A'}</div>
        </div>
        
        <div class="info-section">
            <div class="info-label">Strong's Number</div>
            <div class="info-value">${word.strongs || 'N/A'}</div>
        </div>
        
        <div class="info-section">
            <div class="info-label">Morphology</div>
            <div class="info-value">${word.morphology || 'N/A'}</div>
        </div>
        
        <div class="info-section">
            <div class="info-label">Gloss / Meaning</div>
            <div class="info-value">${word.gloss || 'N/A'}</div>
        </div>
        
        <div class="info-section">
            <div class="info-label">English Translation</div>
            <div class="info-value">${word.english || word.gloss || 'N/A'}</div>
        </div>
    `;
    
    infoDiv.innerHTML = html;
}

// Navigation functions
function loadPreviousChapter() {
    if (!currentTestament || !currentBook || !currentChapter) {
        showStatus('Please load a chapter first', 'error');
        return;
    }
    
    const chapterNum = parseInt(currentChapter);
    const bookSelect = document.getElementById('bookSelect');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const chaptersCount = parseInt(selectedOption.dataset.chapters);
    
    if (chapterNum > 1) {
        currentChapter = (chapterNum - 1).toString();
        document.getElementById('chapterSelect').value = currentChapter;
        loadChapter();
    } else {
        const currentBookIndex = books.findIndex(b => b.book_abbreviation === currentBook);
        if (currentBookIndex > 0) {
            const previousBook = books[currentBookIndex - 1];
            currentBook = previousBook.book_abbreviation;
            bookSelect.value = currentBook;
            
            const prevChaptersCount = parseInt(previousBook.max_chapter);
            populateChapterSelect(prevChaptersCount);
            
            currentChapter = prevChaptersCount.toString();
            document.getElementById('chapterSelect').value = currentChapter;
            
            loadChapter();
        } else {
            showStatus('Already at the first chapter', 'error');
        }
    }
}

function loadNextChapter() {
    if (!currentTestament || !currentBook || !currentChapter) {
        showStatus('Please load a chapter first', 'error');
        return;
    }
    
    const chapterNum = parseInt(currentChapter);
    const bookSelect = document.getElementById('bookSelect');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const chaptersCount = parseInt(selectedOption.dataset.chapters);
    
    if (chapterNum < chaptersCount) {
        currentChapter = (chapterNum + 1).toString();
        document.getElementById('chapterSelect').value = currentChapter;
        loadChapter();
    } else {
        const currentBookIndex = books.findIndex(b => b.book_abbreviation === currentBook);
        if (currentBookIndex < books.length - 1) {
            const nextBook = books[currentBookIndex + 1];
            currentBook = nextBook.book_abbreviation;
            bookSelect.value = currentBook;
            
            const nextChaptersCount = parseInt(nextBook.max_chapter);
            populateChapterSelect(nextChaptersCount);
            
            currentChapter = '1';
            document.getElementById('chapterSelect').value = currentChapter;
            
            loadChapter();
        } else {
            showStatus('Already at the last chapter', 'error');
        }
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    
    if (!prevBtn || !nextBtn) return;
    
    if (!currentTestament || !currentBook || !currentChapter) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }
    
    const chapterNum = parseInt(currentChapter);
    const bookSelect = document.getElementById('bookSelect');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const chaptersCount = parseInt(selectedOption.dataset.chapters);
    const currentBookIndex = books.findIndex(b => b.book_abbreviation === currentBook);
    
    prevBtn.disabled = !(chapterNum > 1 || currentBookIndex > 0);
    nextBtn.disabled = !(chapterNum < chaptersCount || currentBookIndex < books.length - 1);
}

function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 3000);
}