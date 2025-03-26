// State management
let swimmers = [];
let nextId = 1;
let currentLang = 'en'; // Default language

// Translations
const translations = {
  en: {
    appTitle: 'SwimTracker',
    addSwimmer: 'Add Swimmer',
    delete: 'Delete',
    reset: 'Reset',
    laps: 'laps',
    emptyTitle: 'No swimmers added yet',
    emptyText: 'Add your first swimmer using the form above',
    swipeHint: 'Swipe left to delete, right to reset',
    errorRequired: 'Please enter a swimmer name'
  },
  he: {
    appTitle: 'מעקב שחייה',
    addSwimmer: 'הוסף שחיין',
    delete: 'מחק',
    reset: 'אפס',
    laps: 'הקפות',
    emptyTitle: 'עדיין אין שחיינים',
    emptyText: 'הוסף את השחיין הראשון באמצעות הטופס למעלה',
    swipeHint: 'החלק שמאלה למחיקה, ימינה לאיפוס',
    errorRequired: 'אנא הזן שם שחיין'
  }
};

// DOM elements
const addSwimmerForm = document.getElementById('addSwimmerForm');
const swimmerNameInput = document.getElementById('swimmerName');
const errorMessage = document.getElementById('errorMessage');
const swimmersList = document.getElementById('swimmersList');
const emptyState = document.getElementById('emptyState');
const languageToggle = document.getElementById('languageToggle');

// Initialize the app
function init() {
  // Load saved language preference
  loadLanguagePreference();
  
  // Load swimmers and render UI
  loadSwimmers();
  updateLanguage();
  renderSwimmers();
  
  // Apply language to the HTML element
  document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;
  
  // Event listeners
  addSwimmerForm.addEventListener('submit', handleAddSwimmer);
  languageToggle.addEventListener('click', toggleLanguage);
}

// Load language preference from localStorage
function loadLanguagePreference() {
  const savedLang = localStorage.getItem('language');
  if (savedLang === 'en' || savedLang === 'he') {
    currentLang = savedLang;
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Update toggle UI
    const enLabel = document.getElementById('enLabel');
    const heLabel = document.getElementById('heLabel');
    
    if (currentLang === 'en') {
      enLabel.classList.add('active-language');
      heLabel.classList.remove('active-language');
    } else {
      heLabel.classList.add('active-language');
      enLabel.classList.remove('active-language');
    }
  }
}

// Toggle between languages
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'he' : 'en';
  
  // Save preference
  localStorage.setItem('language', currentLang);
  
  // Update direction
  document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;
  
  // Update language toggle UI
  const enLabel = document.getElementById('enLabel');
  const heLabel = document.getElementById('heLabel');
  
  if (currentLang === 'en') {
    enLabel.classList.add('active-language');
    heLabel.classList.remove('active-language');
  } else {
    heLabel.classList.add('active-language');
    enLabel.classList.remove('active-language');
  }
  
  // Update UI text
  updateLanguage();
  renderSwimmers();
}

// Update all UI text based on current language
function updateLanguage() {
  const t = translations[currentLang];
  
  // Update app title
  document.getElementById('appTitle').textContent = t.appTitle;
  
  // Update input placeholder
  swimmerNameInput.placeholder = t.addSwimmer;
  
  // Update empty state
  document.querySelector('.empty-title').textContent = t.emptyTitle;
  document.querySelector('.empty-text').textContent = t.emptyText;
  document.querySelector('.swipe-hint span').textContent = t.swipeHint;
}

// Load swimmers from localStorage
function loadSwimmers() {
  const storedSwimmers = localStorage.getItem('swimmers');
  if (storedSwimmers) {
    swimmers = JSON.parse(storedSwimmers);
    
    // Find the highest ID to set nextId correctly
    if (swimmers.length > 0) {
      const maxId = Math.max(...swimmers.map(s => s.id));
      nextId = maxId + 1;
    }
  }
  
  updateEmptyState();
}

// Save swimmers to localStorage
function saveSwimmers() {
  localStorage.setItem('swimmers', JSON.stringify(swimmers));
  updateEmptyState();
}

// Update empty state visibility
function updateEmptyState() {
  if (swimmers.length === 0) {
    swimmersList.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    swimmersList.classList.remove('hidden');
    emptyState.classList.add('hidden');
  }
}

// Handle adding a new swimmer
function handleAddSwimmer(e) {
  e.preventDefault();
  
  const name = swimmerNameInput.value.trim();
  if (!name) {
    errorMessage.textContent = translations[currentLang].errorRequired;
    return;
  }
  
  errorMessage.textContent = '';
  
  const newSwimmer = {
    id: nextId++,
    name,
    lapCount: 0
  };
  
  swimmers.push(newSwimmer);
  saveSwimmers();
  renderSwimmers();
  
  swimmerNameInput.value = '';
  swimmerNameInput.focus();
}

// Render all swimmers
function renderSwimmers() {
  swimmersList.innerHTML = '';
  
  swimmers.forEach(swimmer => {
    const swimmerElement = createSwimmerElement(swimmer);
    swimmersList.appendChild(swimmerElement);
  });
}

// Create HTML element for a swimmer
function createSwimmerElement(swimmer) {
  const t = translations[currentLang];
  
  // Create wrapper element
  const wrapper = document.createElement('div');
  wrapper.className = 'swimmer-card-wrapper';
  
  // Create delete indicator
  const deleteIndicator = document.createElement('div');
  deleteIndicator.className = 'delete-indicator';
  deleteIndicator.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
      <path d="M3 6h18"></path>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
    <span>${t.delete}</span>
  `;
  
  // Create reset indicator
  const resetIndicator = document.createElement('div');
  resetIndicator.className = 'reset-indicator';
  resetIndicator.innerHTML = `
    <span>${t.reset}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;">
      <path d="M21.5 2v6h-6"></path>
      <path d="M2.5 12.5v7h7"></path>
      <path d="M21.5 8C19.037 4.316 14.83 2.5 10.5 2.5c-6.561 0-9 4-9 4"></path>
      <path d="M2.5 19.5c2.61 2.545 6.152 4 10 4 8.1 0 11-4 11-4"></path>
    </svg>
  `;
  
  // Create card element
  const card = document.createElement('div');
  card.className = 'swimmer-card';
  card.setAttribute('data-id', swimmer.id);
  
  card.innerHTML = `
    <div class="swimmer-card-content">
      <div class="swimmer-info">
        <h3 class="swimmer-name">${swimmer.name}</h3>
      </div>
      <div class="lap-controls">
        <button class="decrement-button" aria-label="Decrease lap count">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
          </svg>
        </button>
        
        <div class="lap-counter">
          <div class="lap-count">${swimmer.lapCount}</div>
          <div class="lap-label">${t.laps}</div>
        </div>
        
        <button class="increment-button" aria-label="Increase lap count">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Set up buttons
  const decrementButton = card.querySelector('.decrement-button');
  const incrementButton = card.querySelector('.increment-button');
  
  decrementButton.addEventListener('click', () => {
    const id = parseInt(card.getAttribute('data-id'));
    decrementLap(id);
  });
  
  incrementButton.addEventListener('click', () => {
    const id = parseInt(card.getAttribute('data-id'));
    incrementLap(id);
  });
  
  // Set up touch/swipe functionality
  setupSwipeActions(card, wrapper, deleteIndicator, resetIndicator, swimmer.id);
  
  // Add elements to wrapper
  wrapper.appendChild(deleteIndicator);
  wrapper.appendChild(resetIndicator);
  wrapper.appendChild(card);
  
  return wrapper;
}

// Set up swipe actions for a swimmer card
function setupSwipeActions(card, wrapper, deleteIndicator, resetIndicator, swimmerId) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  const threshold = 100; // Minimum swipe distance to trigger action
  
  card.addEventListener('touchstart', handleTouchStart);
  card.addEventListener('touchmove', handleTouchMove);
  card.addEventListener('touchend', handleTouchEnd);
  
  card.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    
    currentX = e.touches[0].clientX - startX;
    updateCardPosition(currentX);
  }
  
  function handleTouchEnd() {
    if (!isDragging) return;
    
    handleSwipeEnd();
    isDragging = false;
  }
  
  function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    
    currentX = e.clientX - startX;
    updateCardPosition(currentX);
  }
  
  function handleMouseUp() {
    if (!isDragging) return;
    
    handleSwipeEnd();
    isDragging = false;
  }
  
  function updateCardPosition(x) {
    // Adjust direction based on RTL or LTR
    let adjustedX = x;
    const isRTL = document.documentElement.dir === 'rtl';
    
    if (isRTL) {
      // In RTL, swap left/right swiping
      adjustedX = -x;
    }
    
    // Limit swiping distance
    const limitedX = Math.max(Math.min(adjustedX, 150), -150);
    card.style.transform = `translateX(${limitedX}px)`;
    
    // Show action indicators
    if (limitedX < 0) {
      deleteIndicator.style.opacity = Math.min(Math.abs(limitedX) / 100, 1);
      resetIndicator.style.opacity = 0;
    } else if (limitedX > 0) {
      resetIndicator.style.opacity = Math.min(Math.abs(limitedX) / 100, 1);
      deleteIndicator.style.opacity = 0;
    } else {
      deleteIndicator.style.opacity = 0;
      resetIndicator.style.opacity = 0;
    }
  }
  
  function handleSwipeEnd() {
    const isRTL = document.documentElement.dir === 'rtl';
    
    if (!isRTL && currentX < -threshold || isRTL && currentX > threshold) {
      // Swipe left (LTR) or right (RTL) - delete
      deleteSwimmer(swimmerId);
    } else if (!isRTL && currentX > threshold || isRTL && currentX < -threshold) {
      // Swipe right (LTR) or left (RTL) - reset
      resetLapCount(swimmerId);
    } else {
      // Return to original position
      card.style.transform = 'translateX(0)';
      deleteIndicator.style.opacity = 0;
      resetIndicator.style.opacity = 0;
    }
    
    currentX = 0;
  }
}

// Increment lap count
function incrementLap(id) {
  const swimmer = swimmers.find(s => s.id === id);
  if (swimmer) {
    swimmer.lapCount++;
    saveSwimmers();
    renderSwimmers();
  }
}

// Decrement lap count
function decrementLap(id) {
  const swimmer = swimmers.find(s => s.id === id);
  if (swimmer && swimmer.lapCount > 0) {
    swimmer.lapCount--;
    saveSwimmers();
    renderSwimmers();
  }
}

// Delete swimmer
function deleteSwimmer(id) {
  swimmers = swimmers.filter(s => s.id !== id);
  saveSwimmers();
  renderSwimmers();
}

// Reset lap count
function resetLapCount(id) {
  const swimmer = swimmers.find(s => s.id === id);
  if (swimmer) {
    swimmer.lapCount = 0;
    saveSwimmers();
    renderSwimmers();
  }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);