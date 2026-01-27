// ========================================
// ðŸš€ 3D Printed Rocket - JavaScript
// ========================================

// Three.js variables
let scene, camera, renderer, controls, currentModel;
let modelColor = 0x48dbfb;

// Initialize 3D Viewer
function initViewer() {
    const container = document.getElementById('model-viewer');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera Setup
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(50, 50, 100);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Orbit Controls - NO AUTO ROTATE
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = false;
    controls.minDistance = 30;
    controls.maxDistance = 300;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x48dbfb, 0.4);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    // Top light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 1, 0);
    scene.add(topLight);

    // Grid helper - ON THE BOTTOM (floor)
    const gridHelper = new THREE.GridHelper(200, 20, 0x48dbfb, 0x333333);
    gridHelper.position.y = -30;
    scene.add(gridHelper);

    // Animation loop
    animate();

    // Window resize handler
    window.addEventListener('resize', onWindowResize);

    // Load first model
    loadModel('raketa_szarny.stl');
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Window resize
function onWindowResize() {
    const container = document.getElementById('model-viewer');
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Load STL model
function loadModel(filename, button) {
    // Show loading overlay
    document.getElementById('loading-overlay').style.display = 'flex';

    // Remove previous model
    if (currentModel) {
        scene.remove(currentModel);
    }

    // Update buttons
    if (button) {
        document.querySelectorAll('.viewer-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // STL Loader
    const loader = new THREE.STLLoader();
    
    loader.load(
        filename,
        function (geometry) {
            // Center geometry
            geometry.center();

            // Create material
            const material = new THREE.MeshPhongMaterial({
                color: modelColor,
                specular: 0x444444,
                shininess: 100,
                flatShading: false
            });

            // Create mesh
            currentModel = new THREE.Mesh(geometry, material);

            // Scale model
            const box = new THREE.Box3().setFromObject(currentModel);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 50 / maxDim;
            currentModel.scale.set(scale, scale, scale);

            // STAND UP - Rotate model to be upright
            currentModel.rotation.x = -Math.PI / 2;

            // Position model above the grid
            const newBox = new THREE.Box3().setFromObject(currentModel);
            const newSize = newBox.getSize(new THREE.Vector3());
            currentModel.position.y = newSize.y / 2 - 30;

            scene.add(currentModel);

            // Hide loading overlay
            document.getElementById('loading-overlay').style.display = 'none';

            // Camera position
            camera.position.set(60, 30, 80);
            controls.target.set(0, 0, 0);
            controls.update();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading model:', error);
            document.getElementById('loading-overlay').innerHTML = `
                <div class="error-message">
                    <h3>âš ï¸ Hiba a modell betÃ¶ltÃ©sekor</h3>
                    <p>GyÅ'zÅ'dj meg rÃ³la, hogy a "${filename}" fÃ¡jl elÃ©rhetÅ'.</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">A 3D megjelenÃ­tÃ©shez helyi szerveren kell futtatni az oldalt.</p>
                </div>
            `;
        }
    );
}

// Change model color
function changeModelColor(color) {
    modelColor = new THREE.Color(color).getHex();
    document.getElementById('colorPicker').value = color;
    
    if (currentModel) {
        currentModel.material.color.setHex(modelColor);
    }
}

// Create stars
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        starsContainer.appendChild(star);
    }
}

// ========================================
// ENHANCED COMMENTS SYSTEM WITH PERSISTENT STORAGE
// ========================================

// Load comments from persistent storage
async function getComments() {
    try {
        const result = await window.storage.list('comment:');
        if (!result || !result.keys) {
            return [];
        }
        
        const comments = [];
        for (const key of result.keys) {
            try {
                const data = await window.storage.get(key);
                if (data && data.value) {
                    comments.push(JSON.parse(data.value));
                }
            } catch (err) {
                console.log('Comment not found:', key);
            }
        }
        
        // Sort by date (newest first)
        return comments.sort((a, b) => b.id - a.id);
    } catch (error) {
        console.log('Storage not available, using localStorage fallback');
        // Fallback to localStorage
        const localComments = localStorage.getItem('rocketComments');
        return localComments ? JSON.parse(localComments) : [];
    }
}

// Save a single comment to persistent storage
async function saveComment(comment) {
    try {
        const key = `comment:${comment.id}`;
        await window.storage.set(key, JSON.stringify(comment));
        return true;
    } catch (error) {
        console.log('Storage not available, using localStorage fallback');
        // Fallback to localStorage
        const comments = localStorage.getItem('rocketComments');
        const allComments = comments ? JSON.parse(comments) : [];
        allComments.unshift(comment);
        localStorage.setItem('rocketComments', JSON.stringify(allComments));
        return true;
    }
}

// Add new comment
async function addComment() {
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    const rating = ratingInput ? parseInt(ratingInput.value) : 0;
    
    // Validation
    if (!name) {
        alert(getCurrentLanguage() === 'hu' ? 'Kérlek add meg a neved!' : 'Please enter your name!');
        return;
    }
    
    if (!text) {
        alert(getCurrentLanguage() === 'hu' ? 'Kérlek írj hozzászólást!' : 'Please write a comment!');
        return;
    }
    
    if (!rating) {
        alert(getCurrentLanguage() === 'hu' ? 'Kérlek adj értékelést!' : 'Please give a rating!');
        return;
    }
    
    // Disable submit button to prevent double submission
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.innerHTML = '<span>â³</span><span>' + (getCurrentLanguage() === 'hu' ? 'Mentés...' : 'Saving...') + '</span>';
    
    // Create comment object
    const comment = {
        id: Date.now(),
        name: name,
        text: text,
        rating: rating,
        date: new Date().toLocaleDateString('hu-HU')
    };
    
    // Save comment
    const saved = await saveComment(comment);
    
    if (saved) {
        // Clear form
        nameInput.value = '';
        textInput.value = '';
        if (ratingInput) ratingInput.checked = false;
        
        // Refresh comments display
        await displayComments();
        
        // Show success message
        alert(getCurrentLanguage() === 'hu' ? 'Köszönjük a hozzászólást! ðŸš€' : 'Thank you for your comment! ðŸš€');
    } else {
        alert(getCurrentLanguage() === 'hu' ? 'Hiba történt a mentés során!' : 'Error saving comment!');
    }
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.innerHTML = '<span>ðŸ"¤</span><span data-hu="Hozzászólás küldése" data-en="Submit Comment">' + 
                          (getCurrentLanguage() === 'hu' ? 'Hozzászólás küldése' : 'Submit Comment') + '</span>';
}

// Display comments
async function displayComments() {
    const container = document.getElementById('comments-container');
    const comments = await getComments();
    const lang = getCurrentLanguage();
    
    let html = '';
    
    // Add user comments first
    comments.forEach(comment => {
        const stars = 'â˜…'.repeat(comment.rating) + 'â˜†'.repeat(5 - comment.rating);
        const initial = comment.name.charAt(0).toUpperCase();
        
        html += `
            <div class="comment-card fade-in">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="author-avatar">${initial}</div>
                        <div class="author-info">
                            <h4>${escapeHtml(comment.name)}</h4>
                            <span>${comment.date}</span>
                        </div>
                    </div>
                    <div class="comment-rating">${stars}</div>
                </div>
                <p class="comment-text">${escapeHtml(comment.text)}</p>
            </div>
        `;
    });
    
    // Add example comments at the end
    html += `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">P</div>
                    <div class="author-info">
                        <h4>Péter</h4>
                        <span>2024.01.15</span>
                    </div>
                </div>
                <div class="comment-rating">â˜…â˜…â˜…â˜…â˜…</div>
            </div>
            <p class="comment-text">${lang === 'hu' ? 'Fantasztikus modell! Könnyen ki tudtam nyomtatni a Creality K1-emen. Az összeszerelés is egyszerű volt. Nagyon elégedett vagyok!' : 'Fantastic model! I was able to print it easily on my Creality K1. Assembly was also simple. Very satisfied!'}</p>
        </div>
        
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">A</div>
                    <div class="author-info">
                        <h4>Anna</h4>
                        <span>2024.01.10</span>
                    </div>
                </div>
                <div class="comment-rating">â˜…â˜…â˜…â˜…â˜†</div>
            </div>
            <p class="comment-text">${lang === 'hu' ? 'Szuper dizájn! A kisfiamnak csináltam és imádja. Egyetlen észrevételem, hogy a csatlakozóknál érdemes egy kicsit csiszolni a nyomtatás után.' : 'Super design! I made it for my son and he loves it. My only note is that it\'s worth sanding the connectors a bit after printing.'}</p>
        </div>
        
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">M</div>
                    <div class="author-info">
                        <h4>Márk</h4>
                        <span>2024.01.05</span>
                    </div>
                </div>
                <div class="comment-rating">â˜…â˜…â˜…â˜…â˜…</div>
            </div>
            <p class="comment-text">${lang === 'hu' ? 'Nagyon jól átgondolt, hogy részekre van bontva. Ãgy tényleg bármilyen nyomtatón ki lehet nyomtatni. Köszönöm!' : 'Very well thought out that it\'s split into parts. This way it can really be printed on any printer. Thank you!'}</p>
        </div>
    `;
    
    container.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'hu';
}

// ========================================
// Language System
// ========================================

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    
    document.getElementById('btn-hu').classList.remove('active');
    document.getElementById('btn-en').classList.remove('active');
    document.getElementById('btn-' + lang).classList.add('active');
    
    document.documentElement.lang = lang;
    
    // Translate all elements with data attributes
    const elements = document.querySelectorAll('[data-hu][data-en]');
    elements.forEach(element => {
        const translation = element.getAttribute('data-' + lang);
        if (translation) {
            if (element.innerHTML.includes('<strong>') || 
                element.innerHTML.includes('<br>') || 
                element.innerHTML.includes('<span')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Update placeholders
    const placeholders = document.querySelectorAll('[data-placeholder-hu][data-placeholder-en]');
    placeholders.forEach(element => {
        element.placeholder = element.getAttribute('data-placeholder-' + lang);
    });
    
    // Update page title
    if (lang === 'hu') {
        document.title = '3D Nyomtatott Rakéta';
    } else {
        document.title = '3D Printed Rocket';
    }
    
    // Refresh comments to update example comments language
    displayComments();
}

// ========================================
// Initialize on page load
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initViewer();
    displayComments();
    
    const savedLang = localStorage.getItem('language') || 'hu';
    setLanguage(savedLang);
});