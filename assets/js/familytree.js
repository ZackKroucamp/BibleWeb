let characters = [];
let relationships = [];
let selectedCharacter = null;
let relationshipMode = 'none';
let draggedCharacter = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let editingCharacter = null;
let scale = 1;
let panOffset = { x: 0, y: 0 };
let isPanning = false;
let panStart = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // Try to load user's saved tree first
    loadUserTree();
    
    // Center view on Adam and Eve at the middle of the canvas
    setTimeout(() => {
        const canvasContainer = document.getElementById('canvasContainer');
        const containerRect = canvasContainer.getBoundingClientRect();
        const canvasCenterX = 50000 / 2;
        
        // Pan to show Adam (at canvas center) in the middle of the viewport
        panOffset = { 
            x: containerRect.width / 2 - canvasCenterX * scale,
            y: 50
        };
        updateCanvasTransform();
        updateMinimap();
    }, 100);
});

function loadUserTree() {
    fetch('/bibleweb/api/load_family_tree.php')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.tree_data) {
                try {
                    const data = JSON.parse(result.tree_data);
                    
                    if (data.characters && data.relationships) {
                        characters = data.characters;
                        relationships = data.relationships;
                        
                        characters.forEach(createCharacterElement);
                        updateConnections();
                        updateMinimap();
                        
                        showStatusMessage(`Loaded: ${result.tree_name}`);
                        return;
                    }
                } catch (error) {
                    console.error('Error parsing saved tree:', error);
                }
            }
            
            // If no saved tree or error, load sample data
            loadSampleData();
        })
        .catch(error => {
            console.error('Error loading user tree:', error);
            loadSampleData();
        });
}

function setupEventListeners() {
    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    canvasContainer.addEventListener('mouseleave', handleMouseLeave);
    canvasContainer.addEventListener('wheel', zoom);
    canvasContainer.addEventListener('contextmenu', (e) => e.preventDefault());
}

function handleMouseDown(e) {
    const characterElement = e.target.closest('.character');
    const canvasContainer = document.getElementById('canvasContainer');
    const canvas = document.getElementById('canvas');
    
    if (characterElement && relationshipMode === 'none') {
        isDragging = true;
        draggedCharacter = characters.find(c => c.id == characterElement.dataset.characterId);
        
        const rect = characterElement.getBoundingClientRect();
        const containerRect = canvasContainer.getBoundingClientRect();
        
        dragOffset.x = (e.clientX - containerRect.left - panOffset.x) / scale - draggedCharacter.x;
        dragOffset.y = (e.clientY - containerRect.top - panOffset.y) / scale - draggedCharacter.y;
        
        characterElement.style.cursor = 'grabbing';
        characterElement.style.zIndex = '1000';
        
        e.preventDefault();
        e.stopPropagation();
        
    } else if (e.target === canvasContainer || e.target === canvas || e.target.closest('.character') === null) {
        if (!e.target.closest('button') && !e.target.closest('.character-actions')) {
            isPanning = true;
            panStart = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
            canvasContainer.style.cursor = 'grabbing';
            canvasContainer.classList.add('dragging');
            e.preventDefault();
        }
    }
}

function handleMouseMove(e) {
    if (isDragging && draggedCharacter) {
        const containerRect = document.getElementById('canvasContainer').getBoundingClientRect();
        
        const x = (e.clientX - containerRect.left - panOffset.x) / scale - dragOffset.x;
        const y = (e.clientY - containerRect.top - panOffset.y) / scale - dragOffset.y;
        
        draggedCharacter.x = Math.max(0, x);
        draggedCharacter.y = Math.max(0, y);
        
        const element = document.querySelector(`[data-character-id="${draggedCharacter.id}"]`);
        if (element) {
            element.style.left = draggedCharacter.x + 'px';
            element.style.top = draggedCharacter.y + 'px';
        }
        
        updateConnections();
        updateMinimap();
        e.preventDefault();
        
    } else if (isPanning && !isDragging) {
        const newPanX = e.clientX - panStart.x;
        const newPanY = e.clientY - panStart.y;
        
        panOffset.x = newPanX;
        panOffset.y = newPanY;
        
        updateCanvasTransform();
        updateMinimap();
        e.preventDefault();
    }
}

function handleMouseUp(e) {
    if (isDragging) {
        isDragging = false;
        if (draggedCharacter) {
            const element = document.querySelector(`[data-character-id="${draggedCharacter.id}"]`);
            if (element) {
                element.style.cursor = '';
                element.style.zIndex = '';
            }
            draggedCharacter = null;
        }
    }
    
    if (isPanning) {
        isPanning = false;
        const canvasContainer = document.getElementById('canvasContainer');
        canvasContainer.style.cursor = '';
        canvasContainer.classList.remove('dragging');
    }
}

function handleMouseLeave(e) {
    if (isDragging && draggedCharacter) {
        const element = document.querySelector(`[data-character-id="${draggedCharacter.id}"]`);
        if (element) {
            element.style.cursor = '';
            element.style.zIndex = '';
        }
        isDragging = false;
        draggedCharacter = null;
    }
    
    if (isPanning) {
        isPanning = false;
        document.getElementById('canvasContainer').style.cursor = '';
    }
}

function zoom(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.995 : 1.005; // 10x less sensitive
    scale = Math.max(0.2, Math.min(3, scale * delta));
    updateCanvasTransform();
    updateConnections();
    updateMinimap();
}

function zoomIn() {
    scale = Math.min(3, scale * 1.02); // 10x less sensitive
    updateCanvasTransform();
    updateConnections();
    updateMinimap();
}

function zoomOut() {
    scale = Math.max(0.2, scale * 0.98); // 10x less sensitive
    updateCanvasTransform();
    updateConnections();
    updateMinimap();
}
function resetView() {
    scale = 1;
    const canvasContainer = document.getElementById('canvasContainer');
    const containerRect = canvasContainer.getBoundingClientRect();
    const canvasCenterX = 50000 / 2;
    
    // Center the view on Adam (middle of canvas)
    panOffset = { 
        x: containerRect.width / 2 - canvasCenterX * scale,
        y: 50
    };
    updateCanvasTransform();
    updateConnections();
    updateMinimap();
    showStatusMessage('View reset!');
}

function updateCanvasTransform() {
    const canvas = document.getElementById('canvas');
    canvas.style.transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`;
}

function updateMinimap() {
    const canvas = document.getElementById('minimapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const scaleX = canvas.width / 100000;
    const scaleY = canvas.height / 60000;
    
    characters.forEach(char => {
        ctx.fillStyle = char.sex === 'male' ? '#3b82f6' : '#ec4899';
        ctx.fillRect(char.x * scaleX, char.y * scaleY, 2, 2);
    });
    
    const viewX = -panOffset.x / scale * scaleX;
    const viewY = -panOffset.y / scale * scaleY;
    const viewW = (window.innerWidth / scale) * scaleX;
    const viewH = (window.innerHeight / scale) * scaleY;
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(viewX, viewY, viewW, viewH);
}

function showStatusMessage(message, type = 'success') {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 3000);
}

function addCharacter() {
    editingCharacter = null;
    document.getElementById('modalTitle').textContent = 'Add Character';
    document.getElementById('characterForm').reset();
    document.getElementById('characterModal').style.display = 'block';
}

function editCharacter(characterId) {
    editingCharacter = characters.find(c => c.id === characterId);
    if (editingCharacter) {
        document.getElementById('modalTitle').textContent = 'Edit Character';
        document.getElementById('characterName').value = editingCharacter.name;
        document.getElementById('characterAge').value = editingCharacter.age;
        document.getElementById('characterSex').value = editingCharacter.sex;
        document.getElementById('characterDescription').value = editingCharacter.description;
        document.getElementById('characterModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('characterModal').style.display = 'none';
}

function saveCharacter(e) {
    e.preventDefault();
    const name = document.getElementById('characterName').value;
    const age = parseInt(document.getElementById('characterAge').value) || 0;
    const sex = document.getElementById('characterSex').value;
    const description = document.getElementById('characterDescription').value;

    if (editingCharacter) {
        editingCharacter.name = name;
        editingCharacter.age = age;
        editingCharacter.sex = sex;
        editingCharacter.description = description;
        updateCharacterElement(editingCharacter);
        showStatusMessage('Character updated successfully!');
    } else {
        const canvasContainer = document.getElementById('canvasContainer');
        const containerRect = canvasContainer.getBoundingClientRect();
        
        // Get the center of the current viewport in canvas coordinates
        const viewCenterX = (containerRect.width / 2 - panOffset.x) / scale;
        const viewCenterY = (containerRect.height / 2 - panOffset.y) / scale;
        
        const character = {
            id: Date.now(),
            name,
            age,
            sex,
            description,
            x: Math.max(0, viewCenterX - 100),
            y: Math.max(0, viewCenterY - 70)
        };
        
        characters.push(character);
        createCharacterElement(character);
        showStatusMessage('Character added successfully!');
    }

    closeModal();
    updateConnections();
    updateMinimap();
}

function createCharacterElement(character) {
    const element = document.createElement('div');
    element.className = `character ${character.sex}`;
    element.style.left = character.x + 'px';
    element.style.top = character.y + 'px';
    element.innerHTML = `
        <div class="character-actions">
            <button class="action-btn edit-btn" onclick="editCharacter(${character.id})" title="Edit">✏️</button>
            <button class="action-btn delete-btn" onclick="deleteCharacter(${character.id})" title="Delete">🗑️</button>
        </div>
        <div class="character-name">${character.name}</div>
        <div class="character-info">Age: ${character.age || 'Unknown'}</div>
        <div class="character-info">Sex: ${character.sex}</div>
        ${character.description ? `<div class="character-description">${character.description}</div>` : ''}
    `;
    element.dataset.characterId = character.id;
    element.addEventListener('click', () => selectCharacter(character));
    document.getElementById('canvas').appendChild(element);
}

function updateCharacterElement(character) {
    const element = document.querySelector(`[data-character-id="${character.id}"]`);
    if (element) {
        element.className = `character ${character.sex}`;
        element.innerHTML = `
            <div class="character-actions">
                <button class="action-btn edit-btn" onclick="editCharacter(${character.id})" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteCharacter(${character.id})" title="Delete">🗑️</button>
            </div>
            <div class="character-name">${character.name}</div>
            <div class="character-info">Age: ${character.age || 'Unknown'}</div>
            <div class="character-info">Sex: ${character.sex}</div>
            ${character.description ? `<div class="character-description">${character.description}</div>` : ''}
        `;
    }
}

function deleteCharacter(id) {
    const character = characters.find(c => c.id === id);
    if (character && confirm(`Are you sure you want to delete ${character.name}?`)) {
        characters = characters.filter(c => c.id !== id);
        relationships = relationships.filter(r => r.from !== id && r.to !== id);
        const element = document.querySelector(`[data-character-id="${id}"]`);
        if (element) element.remove();
        updateConnections();
        updateMinimap();
        showStatusMessage('Character deleted successfully!');
    }
}

function selectCharacter(character) {
    if (selectedCharacter) {
        const prevElement = document.querySelector(`[data-character-id="${selectedCharacter.id}"]`);
        if (prevElement) prevElement.classList.remove('selected');
    }

    if (relationshipMode !== 'none' && selectedCharacter && selectedCharacter.id !== character.id) {
        createRelationship(selectedCharacter, character, relationshipMode);
        selectedCharacter = null;
        setRelationshipMode('none');
    } else {
        selectedCharacter = character;
        const element = document.querySelector(`[data-character-id="${character.id}"]`);
        if (element) element.classList.add('selected');
    }
}

function setRelationshipMode(mode) {
    relationshipMode = mode;
    document.querySelectorAll('.relationship-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (selectedCharacter) {
        const element = document.querySelector(`[data-character-id="${selectedCharacter.id}"]`);
        if (element) element.classList.remove('selected');
        selectedCharacter = null;
    }
}

function createRelationship(from, to, type) {
    const exists = relationships.find(r => 
        (r.from === from.id && r.to === to.id && r.type === type) ||
        (r.from === to.id && r.to === from.id && r.type === type)
    );
    
    if (!exists) {
        relationships.push({
            id: Date.now(),
            from: from.id,
            to: to.id,
            type: type
        });
        updateConnections();
        showStatusMessage(`${type} relationship created between ${from.name} and ${to.name}!`);
    } else {
        showStatusMessage('Relationship already exists!', 'error');
    }
}

function updateConnections() {
    const svg = document.getElementById('connectionSvg');
    svg.innerHTML = '';

    svg.setAttribute('width', '100000');
    svg.setAttribute('height', '60000');
    svg.setAttribute('viewBox', '0 0 100000 60000');

    relationships.forEach(rel => {
        const fromChar = characters.find(c => c.id === rel.from);
        const toChar = characters.find(c => c.id === rel.to);
        
        if (fromChar && toChar) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            
            const fromX = fromChar.x + 100;
            const fromY = fromChar.y + 70;
            const toX = toChar.x + 100;
            const toY = toChar.y + 70;
            
            line.setAttribute('x1', fromX);
            line.setAttribute('y1', fromY);
            line.setAttribute('x2', toX);
            line.setAttribute('y2', toY);
            
            line.setAttribute('stroke-linecap', 'round');
            
            if (rel.type === 'marriage') {
                line.setAttribute('stroke', '#ef4444');
                line.setAttribute('stroke-width', '5');
                line.classList.add('marriage-line');
            } else if (rel.type === 'concubine') {
                line.setAttribute('stroke', '#fbbf24');
                line.setAttribute('stroke-width', '4');
                line.setAttribute('stroke-dasharray', '12,6');
                line.classList.add('concubine-line');
            } else if (rel.type === 'child') {
                line.setAttribute('stroke', '#10b981');
                line.setAttribute('stroke-width', '4');
                line.classList.add('child-line');
            }
            
            line.classList.add('connection-line');
            line.style.pointerEvents = 'stroke';
            line.style.cursor = 'pointer';
            line.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteRelationship(rel.id);
            });
            
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `${rel.type} relationship (click to delete)`;
            line.appendChild(title);
            
            svg.appendChild(line);
        }
    });
}

function deleteRelationship(relId) {
    if (confirm('Delete this relationship?')) {
        relationships = relationships.filter(r => r.id !== relId);
        updateConnections();
        showStatusMessage('Relationship deleted!');
    }
}

function saveTree() {
    const data = {
        characters: characters,
        relationships: relationships,
        version: '2.0',
        savedAt: new Date().toISOString()
    };
    
    const jsonData = JSON.stringify(data, null, 2);
    
    // Download JSON file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible_family_tree_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Save to database
    saveToDatabase(jsonData);
    
    showStatusMessage('Family tree saved successfully!');
}

function saveToDatabase(jsonData) {
    // Get tree name from user or use default
    const treeName = prompt('Enter a name for this family tree:', 'My Family Tree') || 'Unnamed Tree';
    
    fetch('/bibleweb/api/save_family_tree.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tree_name: treeName,
            tree_data: jsonData,
            description: `Family tree with ${characters.length} characters and ${relationships.length} relationships`
        })
    })
    .then(response => {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return response.text().then(text => {
                console.error('Non-JSON response:', text);
                throw new Error('Server returned non-JSON response. Check console for details.');
            });
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            showStatusMessage('Saved to database!');
        } else {
            console.error('Database save failed:', result.message);
            showStatusMessage('Database save failed: ' + result.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error saving to database:', error);
        showStatusMessage('Error: ' + error.message, 'error');
    });
}

function loadTree() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.characters || !Array.isArray(data.characters)) {
                    throw new Error('Invalid file format: missing characters array');
                }
                
                if (!data.relationships || !Array.isArray(data.relationships)) {
                    throw new Error('Invalid file format: missing relationships array');
                }
                
                clearTree();
                
                characters = data.characters.map(char => ({
                    id: char.id || Date.now() + Math.random(),
                    name: char.name || 'Unknown',
                    age: char.age || 0,
                    sex: char.sex || 'male',
                    description: char.description || '',
                    x: char.x || Math.random() * 500 + 100,
                    y: char.y || Math.random() * 500 + 100
                }));
                
                relationships = data.relationships.filter(rel => {
                    const fromExists = characters.some(c => c.id === rel.from);
                    const toExists = characters.some(c => c.id === rel.to);
                    return fromExists && toExists;
                }).map(rel => ({
                    id: rel.id || Date.now() + Math.random(),
                    from: rel.from,
                    to: rel.to,
                    type: rel.type || 'child'
                }));
                
                characters.forEach(createCharacterElement);
                updateConnections();
                updateMinimap();
                
                showStatusMessage(`Family tree loaded! ${characters.length} characters, ${relationships.length} relationships`);
                
            } catch (error) {
                console.error('Error loading file:', error);
                showStatusMessage(`Error loading file: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearTree() {
    if (characters.length > 0 && !confirm('Are you sure you want to clear the entire family tree?')) {
        return;
    }
    
    characters = [];
    relationships = [];
    selectedCharacter = null;
    const canvas = document.getElementById('canvas');
    const characterElements = canvas.querySelectorAll('.character');
    characterElements.forEach(el => el.remove());
    document.getElementById('connectionSvg').innerHTML = '';
    updateMinimap();
    showStatusMessage('Family tree cleared!');
}

function loadSampleData() {
    // Calculate center of canvas (50000 width)
    const canvasCenterX = 50000 / 2;
    
    const sampleCharacters = [
        { id: 1, name: 'Adam', age: 930, sex: 'male', description: 'The first man created by God', x: canvasCenterX - 125, y: 200 },
        { id: 2, name: 'Eve', age: 900, sex: 'female', description: 'The first woman, mother of all living', x: canvasCenterX + 125, y: 200 },
        { id: 3, name: 'Cain', age: 800, sex: 'male', description: 'First son of Adam and Eve', x: canvasCenterX - 400, y: 450 },
        { id: 4, name: 'Abel', age: 100, sex: 'male', description: 'Second son, shepherd, murdered by Cain', x: canvasCenterX, y: 450 },
        { id: 5, name: 'Seth', age: 912, sex: 'male', description: 'Third son of Adam and Eve', x: canvasCenterX + 400, y: 450 }
    ];

    const sampleRelationships = [
        { id: 1, from: 1, to: 2, type: 'marriage' },
        { id: 2, from: 1, to: 3, type: 'child' },
        { id: 3, from: 2, to: 3, type: 'child' },
        { id: 4, from: 1, to: 4, type: 'child' },
        { id: 5, from: 2, to: 4, type: 'child' },
        { id: 6, from: 1, to: 5, type: 'child' },
        { id: 7, from: 2, to: 5, type: 'child' }
    ];

    characters = sampleCharacters;
    relationships = sampleRelationships;
    
    characters.forEach(createCharacterElement);
    updateConnections();
    updateMinimap();
}

function autoLayout() {
    if (characters.length === 0) {
        showStatusMessage('No characters to layout!', 'error');
        return;
    }

    const generations = organizeByGenerations();
    const generationHeight = 300;
    const horizontalSpacing = 280;
    const canvasCenterX = 50000 / 2; // Use actual canvas center
    
    generations.forEach((generation, genIndex) => {
        const y = 200 + genIndex * generationHeight;
        
        const males = generation.filter(c => c.sex === 'male');
        const families = [];
        
        males.forEach(male => {
            const family = { male, spouses: [], children: [] };
            
            const marriages = relationships.filter(r => 
                (r.from === male.id || r.to === male.id) && 
                (r.type === 'marriage' || r.type === 'concubine')
            );
            
            marriages.forEach(m => {
                const spouseId = m.from === male.id ? m.to : m.from;
                const spouse = generation.find(c => c.id === spouseId);
                if (spouse) {
                    family.spouses.push({ spouse, type: m.type });
                }
            });
            
            const childRels = relationships.filter(r => 
                r.from === male.id && r.type === 'child'
            );
            
            childRels.forEach(cr => {
                const child = characters.find(c => c.id === cr.to);
                if (child && !generation.includes(child)) {
                    family.children.push(child);
                }
            });
            
            families.push(family);
        });
        
        // Calculate total width needed for this generation
        let totalWidth = 0;
        families.forEach(family => {
            totalWidth += horizontalSpacing; // male
            totalWidth += family.spouses.length * horizontalSpacing;
            totalWidth += horizontalSpacing * 0.5; // spacing between families
        });
        
        // Start position to center the generation
        let currentX = canvasCenterX - (totalWidth / 2);
        
        families.forEach(family => {
            family.male.x = currentX;
            family.male.y = y;
            
            const element = document.querySelector(`[data-character-id="${family.male.id}"]`);
            if (element) {
                element.style.left = family.male.x + 'px';
                element.style.top = family.male.y + 'px';
            }
            
            currentX += horizontalSpacing;
            
            family.spouses.sort((a, b) => {
                if (a.type === 'marriage' && b.type !== 'marriage') return -1;
                if (a.type !== 'marriage' && b.type === 'marriage') return 1;
                return 0;
            });
            
            family.spouses.forEach(s => {
                s.spouse.x = currentX;
                s.spouse.y = y;
                
                const spouseElement = document.querySelector(`[data-character-id="${s.spouse.id}"]`);
                if (spouseElement) {
                    spouseElement.style.left = s.spouse.x + 'px';
                    spouseElement.style.top = s.spouse.y + 'px';
                }
                
                currentX += horizontalSpacing;
            });
            
            if (family.children.length > 0) {
                const familyStartX = family.male.x;
                const familyWidth = currentX - familyStartX;
                const childrenStartX = familyStartX + (familyWidth - (family.children.length * horizontalSpacing)) / 2;
                
                family.children.forEach((child, idx) => {
                    child.x = childrenStartX + idx * horizontalSpacing;
                    child.y = y + generationHeight;
                    
                    const childElement = document.querySelector(`[data-character-id="${child.id}"]`);
                    if (childElement) {
                        childElement.style.left = child.x + 'px';
                        childElement.style.top = child.y + 'px';
                    }
                });
            }
            
            currentX += horizontalSpacing * 0.5;
        });
    });
    
    updateConnections();
    updateMinimap();
    showStatusMessage('Auto-layout applied!');
}

function organizeByGenerations() {
    const generations = [];
    const visited = new Set();
    
    const roots = characters.filter(char => {
        return !relationships.some(rel => 
            rel.type === 'child' && rel.to === char.id
        );
    });
    
    if (roots.length > 0) {
        generations.push(roots);
        roots.forEach(r => visited.add(r.id));
        
        let currentGen = 0;
        while (currentGen < generations.length) {
            const nextGen = [];
            
            generations[currentGen].forEach(parent => {
                const children = relationships
                    .filter(rel => rel.type === 'child' && rel.from === parent.id)
                    .map(rel => characters.find(c => c.id === rel.to))
                    .filter(child => child && !visited.has(child.id));
                
                children.forEach(child => {
                    if (!nextGen.includes(child)) {
                        nextGen.push(child);
                        visited.add(child.id);
                    }
                });
            });
            
            if (nextGen.length > 0) {
                generations.push(nextGen);
            }
            currentGen++;
        }
    }
    
    const remaining = characters.filter(char => !visited.has(char.id));
    if (remaining.length > 0) {
        generations.push(remaining);
    }
    
    return generations;
}

window.onclick = function(event) {
    const modal = document.getElementById('characterModal');
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                saveTree();
                break;
            case 'o':
                e.preventDefault();
                loadTree();
                break;
            case 'n':
                e.preventDefault();
                addCharacter();
                break;
            case 'l':
                e.preventDefault();
                autoLayout();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        closeModal();
        setRelationshipMode('none');
    }
});