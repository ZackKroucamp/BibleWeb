// assets/js/biblereader.js

let versions = [];
let books = [];
let currentVersion = null;
let currentBook = null;
let currentChapter = null;

// Make these available globally for highlights module
window.currentVersion = null;
window.currentBook = null;
window.currentChapter = null;

document.addEventListener('DOMContentLoaded', function() {
    loadVersions();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('versionSelect').addEventListener('change', handleVersionChange);
    document.getElementById('bookSelect').addEventListener('change', handleBookChange);
    document.getElementById('chapterSelect').addEventListener('change', handleChapterChange);
    document.getElementById('loadButton').addEventListener('click', loadChapter);
    
    // Allow Enter key to load chapter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && currentVersion && currentBook && currentChapter) {
            loadChapter();
        }
    });
}

function loadVersions() {
    showStatus('Loading Bible versions...', 'success');
    
    fetch('/bibleweb/api/biblereader.php?action=get_versions')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                versions = result.versions;
                populateVersionSelect();
                showStatus(`Loaded ${versions.length} Bible versions`, 'success');
            } else {
                showStatus('Error loading versions: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showStatus('Error: ' + error.message, 'error');
            console.error('Load versions error:', error);
        });
}

function populateVersionSelect() {
    const select = document.getElementById('versionSelect');
    select.innerHTML = '<option value="">Select a version</option>';
    
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version.code;
        option.textContent = version.name !== version.code 
            ? `${version.name} (${version.code})` 
            : version.code;
        select.appendChild(option);
    });
    
    // Auto-select KJV if available
    const kjvOption = Array.from(select.options).find(opt => opt.value === 'KJV');
    if (kjvOption) {
        select.value = 'KJV';
        handleVersionChange({ target: select });
    }
}

function handleVersionChange(e) {
    currentVersion = e.target.value;
    window.currentVersion = currentVersion;
    currentBook = null;
    window.currentBook = null;
    currentChapter = null;
    window.currentChapter = null;
    
    const bookSelect = document.getElementById('bookSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    
    if (currentVersion) {
        bookSelect.innerHTML = '<option value="">Loading books...</option>';
        bookSelect.disabled = true;
        chapterSelect.innerHTML = '<option value="">Select a book first</option>';
        chapterSelect.disabled = true;
        
        loadBooks(currentVersion);
    } else {
        bookSelect.innerHTML = '<option value="">Select a version first</option>';
        bookSelect.disabled = true;
        chapterSelect.innerHTML = '<option value="">Select a book first</option>';
        chapterSelect.disabled = true;
    }
    
    updateNavigationButtons();
}

function loadBooks(version) {
    fetch(`/bibleweb/api/biblereader.php?action=get_books&version=${version}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                books = result.books;
                populateBookSelect();
            } else {
                showStatus('Error loading books: ' + result.message, 'error');
                document.getElementById('bookSelect').innerHTML = '<option value="">Error loading books</option>';
            }
        })
        .catch(error => {
            showStatus('Error: ' + error.message, 'error');
            console.error('Load books error:', error);
            document.getElementById('bookSelect').innerHTML = '<option value="">Error loading books</option>';
        });
}

function populateBookSelect() {
    const select = document.getElementById('bookSelect');
    select.innerHTML = '<option value="">Select a book</option>';
    
    const hasOT = books.some(b => b.id <= 39);
    const hasNT = books.some(b => b.id >= 40);
    
    if (hasOT && hasNT) {
        const otGroup = document.createElement('optgroup');
        otGroup.label = 'Old Testament';
        books.filter(b => b.id <= 39).forEach(book => {
            const option = createBookOption(book);
            otGroup.appendChild(option);
        });
        select.appendChild(otGroup);
        
        const ntGroup = document.createElement('optgroup');
        ntGroup.label = 'New Testament';
        books.filter(b => b.id >= 40).forEach(book => {
            const option = createBookOption(book);
            ntGroup.appendChild(option);
        });
        select.appendChild(ntGroup);
    } else {
        books.forEach(book => {
            const option = createBookOption(book);
            select.appendChild(option);
        });
    }
    
    select.disabled = false;
}

function createBookOption(book) {
    const option = document.createElement('option');
    option.value = book.id;
    option.dataset.chapters = book.chapters_count;
    option.dataset.name = book.name;
    option.textContent = book.name;
    return option;
}

function handleBookChange(e) {
    currentBook = e.target.value;
    window.currentBook = currentBook;
    currentChapter = null;
    window.currentChapter = null;
    
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
        window.currentChapter = currentChapter;
    }
    
    updateNavigationButtons();
}

function handleChapterChange(e) {
    currentChapter = e.target.value;
    window.currentChapter = currentChapter;
    updateNavigationButtons();
}

function loadChapter() {
    if (!currentVersion || !currentBook || !currentChapter) {
        showStatus('Please select version, book, and chapter', 'error');
        return;
    }
    
    const contentDiv = document.getElementById('bibleContent');
    contentDiv.innerHTML = '<div class="loading">📖 Loading verses...</div>';
    
    const url = `/bibleweb/api/biblereader.php?action=get_verses&version=${currentVersion}&book_id=${currentBook}&chapter=${currentChapter}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                displayVerses(result);
                showStatus(`Loaded ${result.book_name} ${result.chapter}`, 'success');
                updateNavigationButtons();
            } else {
                contentDiv.innerHTML = `<div class="error-message">❌ Error: ${result.message}</div>`;
                showStatus('Error loading verses: ' + result.message, 'error');
            }
        })
        .catch(error => {
            contentDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}</div>`;
            showStatus('Error: ' + error.message, 'error');
            console.error('Load verses error:', error);
        });
}

function displayVerses(data) {
    const contentDiv = document.getElementById('bibleContent');
    
    let html = `
        <div class="chapter-header">
            <div class="version-badge">${data.version_name}</div>
            <h2>${data.book_name} ${data.chapter}</h2>
            <div class="verse-count">${data.verses.length} verses</div>
        </div>
        <div class="verses-container">
    `;
    
    data.verses.forEach(verse => {
        html += `
            <div class="verse" data-verse="${verse.verse}">
                <span class="verse-number">${verse.verse}</span>
                <span class="verse-text">${verse.text}</span>
            </div>
        `;
    });
    
    html += '</div>';
    contentDiv.innerHTML = html;
    
    if (typeof window.enhanceVersesWithHighlights === 'function') {
        window.enhanceVersesWithHighlights();
    }
    
    contentDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 3000);
}

// ============================================================
// NAVIGATION FUNCTIONS
// ============================================================

function loadPreviousChapter() {
    if (!currentVersion || !currentBook || !currentChapter) {
        showStatus('Please load a chapter first', 'error');
        return;
    }
    
    const chapterNum = parseInt(currentChapter);
    const bookSelect = document.getElementById('bookSelect');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const chaptersCount = parseInt(selectedOption.dataset.chapters);
    
    if (chapterNum > 1) {
        // Go to previous chapter in same book
        currentChapter = (chapterNum - 1).toString();
        window.currentChapter = currentChapter;
        document.getElementById('chapterSelect').value = currentChapter;
        loadChapter();
    } else {
        // Go to previous book's last chapter
        const currentBookIndex = books.findIndex(b => b.id == currentBook);
        if (currentBookIndex > 0) {
            const previousBook = books[currentBookIndex - 1];
            currentBook = previousBook.id.toString();
            window.currentBook = currentBook;
            bookSelect.value = currentBook;
            
            // Load chapters for previous book
            const prevChaptersCount = parseInt(previousBook.chapters_count);
            populateChapterSelect(prevChaptersCount);
            
            // Set to last chapter
            currentChapter = prevChaptersCount.toString();
            window.currentChapter = currentChapter;
            document.getElementById('chapterSelect').value = currentChapter;
            
            loadChapter();
        } else {
            showStatus('Already at the first chapter', 'error');
        }
    }
}

function loadNextChapter() {
    if (!currentVersion || !currentBook || !currentChapter) {
        showStatus('Please load a chapter first', 'error');
        return;
    }
    
    const chapterNum = parseInt(currentChapter);
    const bookSelect = document.getElementById('bookSelect');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const chaptersCount = parseInt(selectedOption.dataset.chapters);
    
    if (chapterNum < chaptersCount) {
        // Go to next chapter in same book
        currentChapter = (chapterNum + 1).toString();
        window.currentChapter = currentChapter;
        document.getElementById('chapterSelect').value = currentChapter;
        loadChapter();
    } else {
        // Go to next book's first chapter
        const currentBookIndex = books.findIndex(b => b.id == currentBook);
        if (currentBookIndex < books.length - 1) {
            const nextBook = books[currentBookIndex + 1];
            currentBook = nextBook.id.toString();
            window.currentBook = currentBook;
            bookSelect.value = currentBook;
            
            // Load chapters for next book
            const nextChaptersCount = parseInt(nextBook.chapters_count);
            populateChapterSelect(nextChaptersCount);
            
            // Set to first chapter
            currentChapter = '1';
            window.currentChapter = currentChapter;
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
    
    // Disable buttons if no chapter is loaded
    if (!currentVersion || !currentBook || !currentChapter) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        prevBtn.classList.add('disabled');
        nextBtn.classList.add('disabled');
        return;
    }
    
    const chapterNum = parseInt(currentChapter);
    const bookSelect = document.getElementById('bookSelect');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const chaptersCount = parseInt(selectedOption.dataset.chapters);
    const currentBookIndex = books.findIndex(b => b.id == currentBook);
    
    // Previous button
    const canGoPrevious = chapterNum > 1 || currentBookIndex > 0;
    prevBtn.disabled = !canGoPrevious;
    if (canGoPrevious) {
        prevBtn.classList.remove('disabled');
    } else {
        prevBtn.classList.add('disabled');
    }
    
    // Next button
    const canGoNext = chapterNum < chaptersCount || currentBookIndex < books.length - 1;
    nextBtn.disabled = !canGoNext;
    if (canGoNext) {
        nextBtn.classList.remove('disabled');
    } else {
        nextBtn.classList.add('disabled');
    }
}

// Make functions available globally
window.displayVerses = displayVerses;
window.loadPreviousChapter = loadPreviousChapter;
window.loadNextChapter = loadNextChapter;