/**
 * PORTFOLIO APP
 * Pure vanilla JavaScript - no frameworks, no build tools
 * 
 * Architecture:
 * - State: tracks current page and loaded data
 * - Router: handles URL hash navigation
 * - Renderers: transform JSON into DOM
 * - Sliders: autoplay (home) and manual (detail) controllers
 */

// ================================
// STATE
// ================================
const state = {
    projectsIndex: null,
    currentProject: null,
    currentPage: 'home'
};

// ================================
// ROUTER
// ================================
function initRouter() {
    // Handle hash changes
    window.addEventListener('hashchange', handleRoute);
    
    // Handle initial load
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash.slice(1); // Remove #
    
    if (!hash || hash === 'home') {
        showHomePage();
    } else if (hash === 'other-things') {
        showOtherThingsPage();
    } else if (hash === 'about' || hash === 'contact') {
        // Add these pages later if needed
        showHomePage();
    } else {
        // Assume it's a project ID
        showProjectPage(hash);
    }
}

function navigateTo(path) {
    window.location.hash = path;
}

// ================================
// DATA LOADING
// ================================
async function loadProjectsIndex() {
    try {
        const response = await fetch('data/projects-index.json');
        if (!response.ok) throw new Error('Failed to load projects index');
        state.projectsIndex = await response.json();
        return state.projectsIndex;
    } catch (error) {
        console.error('Error loading projects index:', error);
        return { projects: [] };
    }
}

async function loadProject(projectId) {
    try {
        // Find project in index to get its file path
        const projectMeta = state.projectsIndex.projects.find(p => p.id === projectId);
        if (!projectMeta) throw new Error('Project not found');
        
        const response = await fetch(projectMeta.file);
        if (!response.ok) throw new Error('Failed to load project');
        state.currentProject = await response.json();
        return state.currentProject;
    } catch (error) {
        console.error('Error loading project:', error);
        return null;
    }
}

// ================================
// PAGE RENDERING
// ================================
async function showHomePage() {
    state.currentPage = 'home';
    
    // Load projects if not already loaded
    if (!state.projectsIndex) {
        await loadProjectsIndex();
    }
    
    // Show home page, hide others
    document.getElementById('home-page').classList.add('active');
    document.getElementById('project-page').classList.remove('active');
    const otherThingsPageEl = document.getElementById('other-things-page');
    if (otherThingsPageEl) otherThingsPageEl.classList.remove('active');
    
    // Render content
    renderHomeSlider();
    renderProjectList();
    
    // Update nav
    updateNavigation('home');
}

async function showProjectPage(projectId) {
    state.currentPage = 'project';
    
    // Load project data
    const project = await loadProject(projectId);
    if (!project) {
        showHomePage();
        return;
    }
    
    // Show project page, hide others
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('project-page').classList.add('active');
    document.getElementById('other-things-page').classList.remove('active');
    
    // Render content
    renderProjectDetail(project);
    renderProjectSlider(project);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

async function showOtherThingsPage() {
    state.currentPage = 'other-things';

    // Hide others, show Other Things page
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('project-page').classList.remove('active');
    document.getElementById('other-things-page').classList.add('active');
    updateNavigation('other-things');
}

function updateNavigation(activePage) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href.startsWith('#')) {
            href = href.slice(1);
            link.classList.toggle('active', href === activePage);
        } else {
            link.classList.remove('active');
        }
    });
}

// Other Things page is fully static in HTML—no renderers or data loading required.

// ================================
// HOME PAGE RENDERERS
// ================================
function renderHomeSlider() {
    const slider = document.querySelector('.autoplay-slider .slider-track');
    if (!slider || !state.projectsIndex) return;
    
    // Take first 5 projects for slider
    const projects = state.projectsIndex.projects.slice(0, 8);
    
    slider.innerHTML = projects.map(project => `
        <div class="slider-slide">
            ${project.file ? `<a href="#${project.id}">` : '<div class="disabled-link">'}
                <img src="${project.slider || project.thumbnail}" alt="${project.title}">
            ${project.file ? '</a>' : '</div>'}
        </div>
    `).join('');
    
    // Initialize autoplay
    if (projects.length > 1) {
        initAutoplaySlider(slider, projects.length);
    }
}

function renderProjectList() {
    const list = document.querySelector('.project-list');
    if (!list || !state.projectsIndex) return;
    
    list.innerHTML = state.projectsIndex.projects.map(project => `
        <${project.file ? 'a href="#' + project.id + '"' : 'div'} class="project-item ${!project.file ? 'disabled' : ''}">
            <div class="project-thumbnail">
                <img src="${project.thumbnail}" alt="${project.title}">
            </div>
            <div class="project-item-content">
                <h3 class="project-item-title">${project.title}</h3>
                <p class="project-item-description">${project.description}</p>
            </div>
        </${project.file ? 'a' : 'div'}>
    `).join('');
}

// ================================
// PROJECT PAGE RENDERERS
// ================================
function renderProjectDetail(project) {
    document.querySelector('.project-title').textContent = project.title;
    document.querySelector('.project-description').textContent = project.description;
    
    // Render content (support array of strings OR single string with newlines)
    const contentEl = document.querySelector('.project-content');
    if (typeof project.content === 'string') {
        // Single string: wrap in one <p> and let CSS white-space: pre-line handle newlines
        contentEl.innerHTML = `<p>${project.content}</p>`;
    } else if (Array.isArray(project.content)) {
        // Array of paragraphs: wrap each in <p>
        contentEl.innerHTML = project.content.map(paragraph => `<p>${paragraph}</p>`).join('');
    } else {
        contentEl.innerHTML = '';
    }
    
    // Render links
    const linksEl = document.querySelector('.project-links');
    if (project.links && project.links.length > 0) {
        linksEl.innerHTML = `
            <h3>Related Links</h3>
            <ul>
                ${project.links.map(link => 
                    `<li><a href="${link.url}" target="_blank">${link.label}</a></li>`
                ).join('')}
            </ul>
        `;
    } else {
        linksEl.innerHTML = '';
    }
}

function renderProjectSlider(project) {
    const track = document.querySelector('.manual-slider .slider-track');
    const caption = document.querySelector('.slider-caption');
    const thumbnails = document.querySelector('.slider-thumbnails');
    
    if (!track || !project.images || project.images.length === 0) return;
    
    // Render slides
    track.innerHTML = project.images.map((img, index) => `
        <div class="slider-slide" data-index="${index}">
            <img src="${img.src}" alt="${img.caption || project.title}">
        </div>
    `).join('');
    
    // Render thumbnails
    thumbnails.innerHTML = project.images.map((img, index) => `
        <div class="slider-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${img.src}" alt="${img.caption || project.title}">
        </div>
    `).join('');
    
    // Set initial caption
    caption.textContent = project.images[0].caption || '';
    
    // Initialize manual slider
    initManualSlider(track, caption, thumbnails, project.images);
}

// ================================
// SLIDER CONTROLLERS
// ================================
function initAutoplaySlider(track, slideCount) {
    let currentIndex = 0;
    const intervalTime = 4000; // 3 seconds per slide
    const slides = track.querySelectorAll('.slider-slide');
    
    // Set first slide as active
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    function goToSlide(index) {
        // Remove active from current
        slides[currentIndex].classList.remove('active');
        
        // Update index and add active to new slide
        currentIndex = index % slideCount;
        slides[currentIndex].classList.add('active');
    }
    
    // Autoplay
    const interval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, intervalTime);
    
    // Stop autoplay when user leaves home page
    const observer = new MutationObserver(() => {
        if (!document.getElementById('home-page').classList.contains('active')) {
            clearInterval(interval);
            observer.disconnect();
        }
    });
    
    observer.observe(document.getElementById('home-page'), {
        attributes: true,
        attributeFilter: ['class']
    });
}

function initManualSlider(track, caption, thumbnails, images) {
    let currentIndex = 0;
    const slides = track.querySelectorAll('.slider-slide');
    
    // Set first slide as active
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    function goToSlide(index) {
        // Remove active from current slide
        slides[currentIndex].classList.remove('active');
        
        // Update index and add active to new slide
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        
        // Update caption
        caption.textContent = images[currentIndex].caption || '';
        
        // Update active thumbnail
        thumbnails.querySelectorAll('.slider-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Thumbnail click handlers
    thumbnails.querySelectorAll('.slider-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            goToSlide(index);
        });
    });
}

// ================================
// INITIALIZATION
// ================================
async function init() {
    await loadProjectsIndex();
    initRouter();
}

// Start the app
init();
