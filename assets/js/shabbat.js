// assets/js/shabbat.js

// Current portion data (loaded from database)
let currentPortion = null;

// Get user's location
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            error => {
                // If user denies location, use default (Jerusalem)
                console.warn('Location access denied, using default location');
                resolve({
                    latitude: 31.7683,
                    longitude: 35.2137,
                    isDefault: true
                });
            }
        );
    });
}

// Fetch Shabbat times from Hebcal API
async function fetchShabbatTimes(latitude, longitude) {
    try {
        const response = await fetch(
            `https://www.hebcal.com/shabbat?cfg=json&geo=pos&latitude=${latitude}&longitude=${longitude}&m=50`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch Shabbat times');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Shabbat times:', error);
        throw error;
    }
}

// Format time to 12-hour format
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}

// Show status message
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 3000);
}

// Display Shabbat times
async function displayShabbatTimes() {
    const timesLoading = document.getElementById('times-loading');
    const timesContent = document.getElementById('times-content');

    try {
        // Get location
        const location = await getUserLocation();
        
        // Fetch Shabbat times
        const shabbatData = await fetchShabbatTimes(location.latitude, location.longitude);
        
        // Update location name
        const locationName = document.getElementById('location-name');
        if (location.isDefault) {
            locationName.textContent = shabbatData.location.title + ' (Default)';
        } else {
            locationName.textContent = shabbatData.location.title;
        }

        // Find candle lighting and havdalah times
        let candleLighting = null;
        let havdalah = null;
        let parashaName = null;

        shabbatData.items.forEach(item => {
            if (item.category === 'candles') {
                candleLighting = item;
            } else if (item.category === 'havdalah') {
                havdalah = item;
            } else if (item.category === 'parashat') {
                parashaName = item.hebrew || item.title;
            }
        });

        // Update times
        if (candleLighting) {
            document.getElementById('candle-time').textContent = formatTime(candleLighting.date);
            document.getElementById('candle-date').textContent = formatDate(candleLighting.date);
        }
        if (havdalah) {
            document.getElementById('havdalah-time').textContent = formatTime(havdalah.date);
            document.getElementById('havdalah-date').textContent = formatDate(havdalah.date);
        }
        if (parashaName) {
            document.getElementById('current-parasha-name').textContent = parashaName;
        }

        // Show content, hide loading
        timesLoading.style.display = 'none';
        timesContent.style.display = 'block';
        
        showStatus('Shabbat times loaded successfully', 'success');

    } catch (error) {
        console.error('Error displaying Shabbat times:', error);
        timesLoading.innerHTML = `
            <p style="color: #ef4444;">Unable to load Shabbat times. Please check your connection and try again.</p>
        `;
        showStatus('Failed to load Shabbat times', 'error');
    }
}

// Fetch Torah portion from database
async function fetchTorahPortion() {
    try {
        const response = await fetch('/bibleweb/api/shabbat_portion.php?action=get_current_portion');
        
        if (!response.ok) {
            throw new Error('Failed to fetch Torah portion');
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load portion');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching Torah portion:', error);
        throw error;
    }
}

// Display Torah portion
async function displayTorahPortion() {
    const portionLoading = document.getElementById('portion-loading');
    const portionHeaderContent = document.getElementById('portion-header-content');
    const portionBody = document.getElementById('portion-body');

    try {
        // Fetch portion from database
        currentPortion = await fetchTorahPortion();

        // Update header
        document.getElementById('portion-title').textContent = `Parashat ${currentPortion.name}`;
        document.getElementById('portion-hebrew').textContent = currentPortion.hebrew;
        document.getElementById('portion-range').textContent = currentPortion.range;

        // Show header content
        portionLoading.style.display = 'none';
        portionHeaderContent.style.display = 'block';

        // Update summary
        document.getElementById('summary-content').innerHTML = `<p>${currentPortion.summary}</p>`;

        // Update Torah verses
        const versesContainer = document.getElementById('verses-container');
        versesContainer.innerHTML = currentPortion.keyVerses.map(verse => `
            <div class="verse-card">
                <div class="verse-reference">${verse.reference}</div>
                <div class="verse-text">"${verse.verse_text}"</div>
                <div class="verse-commentary">${verse.commentary}</div>
            </div>
        `).join('');

        // Update Haftarah
        if (currentPortion.haftarah) {
            const haftarahReference = document.getElementById('haftarah-reference');
            const haftarahContainer = document.getElementById('haftarah-container');
            
            haftarahReference.textContent = currentPortion.haftarah.reference;
            haftarahContainer.innerHTML = currentPortion.haftarah.verses.map(verse => `
                <div class="haftarah-card">
                    <div class="scripture-reference">${verse.reference}</div>
                    <div class="scripture-text">"${verse.verse_text}"</div>
                    <div class="scripture-commentary">${verse.commentary}</div>
                </div>
            `).join('');
        }

        // Update New Testament
        const ntContainer = document.getElementById('nt-container');
        ntContainer.innerHTML = currentPortion.newTestament.connections.map(connection => `
            <div class="nt-card">
                <div class="scripture-reference">${connection.reference}</div>
                <div class="scripture-text">"${connection.verse_text}"</div>
                <div class="scripture-commentary">${connection.commentary}</div>
            </div>
        `).join('');

        // Update teaching
        document.getElementById('teaching-content').innerHTML = 
            currentPortion.teaching.split('\n\n').map(para => `<p>${para}</p>`).join('');

        // Update themes
        const themesGrid = document.getElementById('themes-grid');
        themesGrid.innerHTML = currentPortion.themes.map(theme => `
            <div class="theme-card">
                <div class="theme-title">${theme.title}</div>
                <div class="theme-description">${theme.description}</div>
            </div>
        `).join('');

        // Update questions
        const questionsList = document.getElementById('questions-list');
        questionsList.innerHTML = currentPortion.questions.map((question, index) => `
            <div class="question-item">
                <span class="question-number">${index + 1}</span>
                <span class="question-text">${question}</span>
            </div>
        `).join('');

        // Show content
        portionBody.style.display = 'block';
        
        showStatus('Torah portion loaded', 'success');

    } catch (error) {
        console.error('Error displaying Torah portion:', error);
        portionLoading.innerHTML = `
            <p style="color: #ef4444;">Unable to load Torah portion. Please try again later.</p>
        `;
        showStatus('Failed to load Torah portion', 'error');
    }
}

// Refresh Shabbat times
function refreshShabbatTimes() {
    const timesContent = document.getElementById('times-content');
    const timesLoading = document.getElementById('times-loading');
    
    timesContent.style.display = 'none';
    timesLoading.style.display = 'block';
    
    displayShabbatTimes();
}

// Print portion
function printPortion() {
    window.print();
    showStatus('Opening print dialog...', 'info');
}

// Share Shabbat
function shareShabbat() {
    if (!currentPortion) {
        showStatus('Portion not loaded yet', 'error');
        return;
    }
    
    const text = `This week's Torah portion: ${currentPortion.name} (${currentPortion.hebrew}) - ${currentPortion.range}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Shabbat Portion',
            text: text,
            url: window.location.href
        }).then(() => {
            showStatus('Shared successfully', 'success');
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showStatus('Copied to clipboard', 'success');
    } catch (err) {
        showStatus('Failed to copy', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayShabbatTimes();
    displayTorahPortion();
});

// Mobile menu toggle
document.addEventListener('click', function(event) {
    const nav = document.getElementById('nav-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (nav && toggle && !nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('show');
    }
});