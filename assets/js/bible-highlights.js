// assets/js/bible-highlights.js
// Bible Highlights Module

let highlightMode = false;
let currentHighlights = {};
let highlightColors = ['yellow', 'green', 'blue', 'pink', 'orange', 'purple'];
let colorPickerModal = null;
let selectedVerseForHighlight = null;

function initHighlights() {
    createColorPickerModal();
    setupHighlightListeners();
}

function createColorPickerModal() {
    const modal = document.createElement('div');
    modal.id = 'colorPickerModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content color-picker-modal">
            <span class="close" onclick="closeColorPicker()">&times;</span>
            <h3>Highlight Verse</h3>
            
            <div class="color-picker">
                ${highlightColors.map(color => `
                    <button class="color-btn color-${color}" 
                            onclick="selectHighlightColor('${color}')"
                            title="${color}">
                    </button>
                `).join('')}
            </div>
            
            <div class="highlight-note">
                <label>Add Note (Optional):</label>
                <textarea id="highlightNote" placeholder="Add a personal note..." rows="3"></textarea>
            </div>
            
            <div class="highlight-actions">
                <button class="btn" onclick="saveCurrentHighlight()">
                    <span class="btn-icon">💾</span>
                    <span class="btn-text">Save Highlight</span>
                </button>
                <button class="btn danger-btn" onclick="removeCurrentHighlight()">
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">Remove</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    colorPickerModal = modal;
}

function setupHighlightListeners() {
    // Add click listeners to verses when they're loaded
    // This will be called after verses are displayed
}

function toggleHighlightMode() {
    highlightMode = !highlightMode;
    
    const btn = event.target.closest('.tool-btn');
    if (btn) {
        btn.classList.toggle('active', highlightMode);
    }
    
    if (highlightMode) {
        showStatus('Click any verse to highlight it', 'success');
        enableVerseClicking();
    } else {
        showStatus('Highlight mode disabled', 'success');
        disableVerseClicking();
    }
}

function enableVerseClicking() {
    const verses = document.querySelectorAll('.verse');
    verses.forEach(verse => {
        verse.style.cursor = 'pointer';
        verse.classList.add('clickable');
    });
}

function disableVerseClicking() {
    const verses = document.querySelectorAll('.verse');
    verses.forEach(verse => {
        verse.style.cursor = '';
        verse.classList.remove('clickable');
    });
}

function handleVerseClick(verseNumber) {
    if (!highlightMode) return;
    
    selectedVerseForHighlight = {
        version: currentVersion,
        book_id: currentBook,
        chapter: currentChapter,
        verse: verseNumber
    };
    
    // Check if verse already has a highlight
    const key = `${currentBook}_${currentChapter}_${verseNumber}`;
    const existing = currentHighlights[key];
    
    if (existing) {
        // Pre-select existing color and note
        document.getElementById('highlightNote').value = existing.note || '';
        preselectColor(existing.color);
    } else {
        document.getElementById('highlightNote').value = '';
    }
    
    openColorPicker();
}

function preselectColor(color) {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const btn = document.querySelector(`.color-${color}`);
    if (btn) {
        btn.classList.add('selected');
    }
}

function openColorPicker() {
    const modal = document.getElementById('colorPickerModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeColorPicker() {
    const modal = document.getElementById('colorPickerModal');
    if (modal) {
        modal.style.display = 'none';
    }
    selectedVerseForHighlight = null;
}

let selectedColor = null;

function selectHighlightColor(color) {
    selectedColor = color;
    
    // Visual feedback
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
}

function saveCurrentHighlight() {
    if (!selectedVerseForHighlight || !selectedColor) {
        showStatus('Please select a color', 'error');
        return;
    }
    
    const note = document.getElementById('highlightNote').value;
    
    const data = {
        action: 'save',
        version: selectedVerseForHighlight.version,
        book_id: selectedVerseForHighlight.book_id,
        chapter: selectedVerseForHighlight.chapter,
        verse: selectedVerseForHighlight.verse,
        color: selectedColor,
        note: note
    };
    
    fetch('/bibleweb/api/bible_highlights.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Update local cache
            const key = `${data.book_id}_${data.chapter}_${data.verse}`;
            currentHighlights[key] = {
                color: selectedColor,
                note: note
            };
            
            // Apply highlight to verse element
            applyHighlightToVerse(data.verse, selectedColor);
            
            showStatus('Highlight saved!', 'success');
            closeColorPicker();
        } else {
            showStatus('Error: ' + result.message, 'error');
        }
    })
    .catch(error => {
        showStatus('Error: ' + error.message, 'error');
        console.error('Save highlight error:', error);
    });
}

function removeCurrentHighlight() {
    if (!selectedVerseForHighlight) {
        return;
    }
    
    const data = {
        action: 'delete',
        version: selectedVerseForHighlight.version,
        book_id: selectedVerseForHighlight.book_id,
        chapter: selectedVerseForHighlight.chapter,
        verse: selectedVerseForHighlight.verse
    };
    
    fetch('/bibleweb/api/bible_highlights.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Remove from local cache
            const key = `${data.book_id}_${data.chapter}_${data.verse}`;
            delete currentHighlights[key];
            
            // Remove highlight from verse element
            removeHighlightFromVerse(data.verse);
            
            showStatus('Highlight removed!', 'success');
            closeColorPicker();
        } else {
            showStatus('Error: ' + result.message, 'error');
        }
    })
    .catch(error => {
        showStatus('Error: ' + error.message, 'error');
        console.error('Delete highlight error:', error);
    });
}

function loadHighlights() {
    if (!currentVersion || !currentBook || !currentChapter) {
        return;
    }
    
    const url = `/bibleweb/api/bible_highlights.php?action=get&version=${currentVersion}&book_id=${currentBook}&chapter=${currentChapter}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                currentHighlights = {};
                
                result.highlights.forEach(highlight => {
                    const key = `${currentBook}_${currentChapter}_${highlight.verse}`;
                    currentHighlights[key] = {
                        color: highlight.color,
                        note: highlight.note
                    };
                    
                    // Apply highlight to verse
                    applyHighlightToVerse(highlight.verse, highlight.color);
                });
            }
        })
        .catch(error => {
            console.error('Load highlights error:', error);
        });
}

function applyHighlightToVerse(verseNumber, color) {
    const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
    if (verseElement) {
        verseElement.classList.add('highlighted', `highlight-${color}`);
    }
}

function removeHighlightFromVerse(verseNumber) {
    const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
    if (verseElement) {
        verseElement.classList.remove('highlighted');
        highlightColors.forEach(color => {
            verseElement.classList.remove(`highlight-${color}`);
        });
    }
}

// Override the displayVerses function to add click handlers
const originalDisplayVerses = window.displayVerses;
window.displayVerses = function(data) {
    originalDisplayVerses(data);
    
    // Load highlights after verses are displayed
    loadHighlights();
    
    // Add click handlers to verses
    const verses = document.querySelectorAll('.verse');
    verses.forEach(verse => {
        const verseNumber = parseInt(verse.dataset.verse);
        verse.addEventListener('click', () => {
            handleVerseClick(verseNumber);
        });
    });
};

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHighlights);
} else {
    initHighlights();
}