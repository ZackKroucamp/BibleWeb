// assets/js/bible-preferences.js
// Bible Preferences Module - Theme, Font Size, Settings

let currentPreferences = {
    theme: 'dark',
    font_size: 16,
    default_version: 'KJV',
    parallel_view_enabled: 0,
    parallel_version: null,
    sync_scroll: 1
};

let preferencesModal = null;
let savePrefTimer = null;

function initPreferences() {
    createPreferencesModal();
    loadPreferences();
}

function createPreferencesModal() {
    const modal = document.createElement('div');
    modal.id = 'preferencesModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content preferences-modal">
            <span class="close" onclick="closePreferences()">&times;</span>
            <h2>⚙️ Bible Reader Settings</h2>
            
            <div class="preferences-form">
                <div class="pref-section">
                    <h3>Appearance</h3>
                    
                    <div class="pref-group">
                        <label>Theme:</label>
                        <div class="theme-buttons">
                            <button class="theme-btn" data-theme="dark" onclick="setTheme('dark')">
                                🌙 Dark
                            </button>
                            <button class="theme-btn" data-theme="light" onclick="setTheme('light')">
                                ☀️ Light
                            </button>
                        </div>
                    </div>
                    
                    <div class="pref-group">
                        <label>Font Size:</label>
                        <div class="font-size-controls">
                            <button class="btn-sm" onclick="changeFontSize(-2)">
                                <span style="font-size: 0.8rem">A</span>
                            </button>
                            <span id="fontSizeDisplay" class="font-size-value">16px</span>
                            <button class="btn-sm" onclick="changeFontSize(2)">
                                <span style="font-size: 1.2rem">A</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="pref-section">
                    <h3>Reading</h3>
                    
                    <div class="pref-group">
                        <label>Default Bible Version:</label>
                        <select id="defaultVersionSelect" class="control-select" onchange="setDefaultVersion(this.value)">
                            <!-- Populated dynamically -->
                        </select>
                    </div>
                </div>
                
                <div class="pref-section">
                    <h3>Advanced</h3>
                    
                    <div class="pref-group checkbox-group">
                        <label>
                            <input type="checkbox" id="parallelViewEnabled" onchange="toggleParallelPref(this.checked)">
                            Enable Parallel View by default
                        </label>
                    </div>
                    
                    <div class="pref-group" id="parallelVersionGroup" style="display: none;">
                        <label>Parallel Version:</label>
                        <select id="parallelVersionSelect" class="control-select" onchange="setParallelVersion(this.value)">
                            <!-- Populated dynamically -->
                        </select>
                    </div>
                    
                    <div class="pref-group checkbox-group">
                        <label>
                            <input type="checkbox" id="syncScrollEnabled" onchange="setSyncScroll(this.checked)">
                            Synchronize scrolling in parallel view
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="preferences-footer">
                <button class="btn" onclick="savePreferencesToDB()">
                    <span class="btn-icon">💾</span>
                    <span class="btn-text">Save Settings</span>
                </button>
                <button class="btn" onclick="resetPreferences()">
                    <span class="btn-icon">🔄</span>
                    <span class="btn-text">Reset to Defaults</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    preferencesModal = modal;
}

function openPreferences() {
    const modal = document.getElementById('preferencesModal');
    if (!modal) {
        initPreferences();
        return;
    }
    
    modal.style.display = 'block';
    
    // Populate version dropdowns
    populateVersionDropdowns();
    
    // Apply current preferences to UI
    updatePreferencesUI();
}

function closePreferences() {
    const modal = document.getElementById('preferencesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function populateVersionDropdowns() {
    const defaultSelect = document.getElementById('defaultVersionSelect');
    const parallelSelect = document.getElementById('parallelVersionSelect');
    
    if (defaultSelect.options.length === 0 && versions.length > 0) {
        versions.forEach(version => {
            const option1 = document.createElement('option');
            option1.value = version.code;
            option1.textContent = version.name !== version.code 
                ? `${version.name} (${version.code})` 
                : version.code;
            defaultSelect.appendChild(option1);
            
            const option2 = option1.cloneNode(true);
            parallelSelect.appendChild(option2);
        });
    }
}

function updatePreferencesUI() {
    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentPreferences.theme);
    });
    
    // Update font size display
    document.getElementById('fontSizeDisplay').textContent = currentPreferences.font_size + 'px';
    
    // Update version selects
    document.getElementById('defaultVersionSelect').value = currentPreferences.default_version;
    document.getElementById('parallelVersionSelect').value = currentPreferences.parallel_version || '';
    
    // Update checkboxes
    const parallelEnabled = document.getElementById('parallelViewEnabled');
    parallelEnabled.checked = currentPreferences.parallel_view_enabled == 1;
    
    const syncEnabled = document.getElementById('syncScrollEnabled');
    syncEnabled.checked = currentPreferences.sync_scroll == 1;
    
    // Show/hide parallel version selector
    const parallelGroup = document.getElementById('parallelVersionGroup');
    parallelGroup.style.display = parallelEnabled.checked ? 'block' : 'none';
}

function loadPreferences() {
    // Load from localStorage first (instant)
    const localPrefs = localStorage.getItem('biblePreferences');
    if (localPrefs) {
        try {
            currentPreferences = JSON.parse(localPrefs);
            applyPreferences(currentPreferences);
        } catch (e) {
            console.error('Error parsing local preferences:', e);
        }
    }
    
    // Load from database (backup/sync)
    fetch('/bibleweb/api/bible_preferences.php?action=get')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.preferences) {
                currentPreferences = result.preferences;
                localStorage.setItem('biblePreferences', JSON.stringify(currentPreferences));
                applyPreferences(currentPreferences);
            }
        })
        .catch(error => {
            console.error('Error loading preferences:', error);
        });
}

function applyPreferences(prefs) {
    // Apply theme
    document.body.dataset.theme = prefs.theme;
    document.body.classList.toggle('light-theme', prefs.theme === 'light');
    
    // Apply font size
    document.documentElement.style.setProperty('--verse-font-size', prefs.font_size + 'px');
    
    // Set default version if Bible Reader is open
    if (currentVersion === null && prefs.default_version) {
        const versionSelect = document.getElementById('versionSelect');
        if (versionSelect) {
            versionSelect.value = prefs.default_version;
            handleVersionChange({ target: versionSelect });
        }
    }
}

function setTheme(theme) {
    currentPreferences.theme = theme;
    applyPreferences(currentPreferences);
    savePrefDebounced();
    updatePreferencesUI();
}

function changeFontSize(delta) {
    const newSize = Math.max(12, Math.min(24, currentPreferences.font_size + delta));
    currentPreferences.font_size = newSize;
    applyPreferences(currentPreferences);
    savePrefDebounced();
    
    // Update display in modal
    const display = document.getElementById('fontSizeDisplay');
    if (display) {
        display.textContent = newSize + 'px';
    }
}

function setDefaultVersion(version) {
    currentPreferences.default_version = version;
    savePrefDebounced();
}

function toggleParallelPref(enabled) {
    currentPreferences.parallel_view_enabled = enabled ? 1 : 0;
    savePrefDebounced();
    
    // Show/hide parallel version selector
    const parallelGroup = document.getElementById('parallelVersionGroup');
    parallelGroup.style.display = enabled ? 'block' : 'none';
}

function setParallelVersion(version) {
    currentPreferences.parallel_version = version;
    savePrefDebounced();
}

function setSyncScroll(enabled) {
    currentPreferences.sync_scroll = enabled ? 1 : 0;
    savePrefDebounced();
}

function savePrefDebounced() {
    // Save to localStorage immediately
    localStorage.setItem('biblePreferences', JSON.stringify(currentPreferences));
    
    // Debounce database save (wait 1 second after last change)
    clearTimeout(savePrefTimer);
    savePrefTimer = setTimeout(() => {
        savePreferencesToDB();
    }, 1000);
}

function savePreferencesToDB() {
    const formData = new URLSearchParams({
        action: 'save',
        theme: currentPreferences.theme,
        font_size: currentPreferences.font_size,
        default_version: currentPreferences.default_version,
        parallel_view_enabled: currentPreferences.parallel_view_enabled,
        parallel_version: currentPreferences.parallel_version || '',
        sync_scroll: currentPreferences.sync_scroll
    });
    
    fetch('/bibleweb/api/bible_preferences.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showStatus('Preferences saved!', 'success');
        } else {
            showStatus('Error saving: ' + result.message, 'error');
        }
    })
    .catch(error => {
        console.error('Save preferences error:', error);
    });
}

function resetPreferences() {
    if (!confirm('Reset all preferences to defaults?')) {
        return;
    }
    
    currentPreferences = {
        theme: 'dark',
        font_size: 16,
        default_version: 'KJV',
        parallel_view_enabled: 0,
        parallel_version: null,
        sync_scroll: 1
    };
    
    applyPreferences(currentPreferences);
    updatePreferencesUI();
    savePrefDebounced();
    
    showStatus('Preferences reset to defaults', 'success');
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreferences);
} else {
    initPreferences();
}