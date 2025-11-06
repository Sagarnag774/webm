// API Base URL - Will be updated based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/.netlify/functions/api';

// Global state
let currentPets = [];
let currentStories = [];
let currentBlogPosts = [];

// DOM Elements
const contrastToggle = document.getElementById('contrastToggle');
const textSizeIncrease = document.getElementById('textSizeIncrease');
const textSizeDecrease = document.getElementById('textSizeDecrease');
const readAloudToggle = document.getElementById('readAloudToggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    initializeAccessibility();
    initializeMobileMenu();
    
    // Load data based on current page
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            await loadStats();
            await loadFeaturedPets();
            break;
        case 'adopt':
            await loadPets();
            initializeAdoptionForm();
            break;
        case 'stories':
            await loadStories();
            initializeStoryForm();
            break;
        case 'blog':
            await loadBlogPosts();
            initializeNewsletterForm();
            break;
        case 'volunteer':
            initializeVolunteerForm();
            break;
        case 'donate':
            initializeDonationForm();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('adopt.html')) return 'adopt';
    if (path.includes('volunteer.html')) return 'volunteer';
    if (path.includes('donate.html')) return 'donate';
    if (path.includes('stories.html')) return 'stories';
    if (path.includes('blog.html')) return 'blog';
    return 'index';
}

// Accessibility functions
function initializeAccessibility() {
    // Load saved preferences
    loadAccessibilityPreferences();
    
    // Add event listeners
    if (contrastToggle) {
        contrastToggle.addEventListener('click', toggleContrast);
    }
    if (textSizeIncrease) {
        textSizeIncrease.addEventListener('click', increaseTextSize);
    }
    if (textSizeDecrease) {
        textSizeDecrease.addEventListener('click', decreaseTextSize);
    }
    if (readAloudToggle) {
        readAloudToggle.addEventListener('click', toggleReadAloud);
    }
}

function loadAccessibilityPreferences() {
    // Load high contrast preference
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Load text size preference
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        document.body.style.fontSize = savedTextSize;
    }
}

function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

function increaseTextSize() {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    const newSize = currentSize + 2;
    document.body.style.fontSize = newSize + 'px';
    localStorage.setItem('textSize', newSize + 'px');
}

function decreaseTextSize() {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    const newSize = Math.max(12, currentSize - 2); // Minimum 12px
    document.body.style.fontSize = newSize + 'px';
    localStorage.setItem('textSize', newSize + 'px');
}

function toggleReadAloud() {
    alert('Read aloud feature would be implemented with a text-to-speech API. This is a demonstration feature.');
}

// Mobile menu functionality
function initializeMobileMenu() {
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// API utility functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Stats loading for homepage
async function loadStats() {
    try {
        const stats = await apiCall('/stats');
        
        // Animate counting up
        if (document.getElementById('petsRescued')) {
            animateCounter('petsRescued', stats.petsRescued);
            animateCounter('successfulAdoptions', stats.successfulAdoptions);
            animateCounter('volunteers', stats.volunteers);
            animateCounter('cities', stats.cities);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        // Set default values
        if (document.getElementById('petsRescued')) {
            animateCounter('petsRescued', 1250);
            animateCounter('successfulAdoptions', 890);
            animateCounter('volunteers', 156);
            animateCounter('cities', 24);
        }
    }
}

function animateCounter(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000;
    const step = targetNumber / (duration / 16);
    
    let currentNumber = 0;
    
    const timer = setInterval(() => {
        currentNumber += step;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber).toLocaleString();
    }, 16);
}

// Featured pets for homepage
async function loadFeaturedPets() {
    try {
        const pets = await apiCall('/pets');
        currentPets = pets;
        renderFeaturedPets(pets.slice(0, 3)); // Show first 3 pets
    } catch (error) {
        console.error('Error loading featured pets:', error);
        const samplePets = getSamplePets();
        renderFeaturedPets(samplePets.slice(0, 3));
    }
}

function renderFeaturedPets(pets) {
    const featuredPetsGrid = document.getElementById('featuredPetsGrid');
    if (!featuredPetsGrid) return;
    
    featuredPetsGrid.innerHTML = '';
    
    if (pets.length === 0) {
        featuredPetsGrid.innerHTML = '<div class="no-pets">No pets available at the moment. Please check back later.</div>';
        return;
    }
    
    pets.forEach(pet => {
        const petCard = createPetCard(pet);
        featuredPetsGrid.appendChild(petCard);
    });
}

function createPetCard(pet) {
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    petCard.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}" class="pet-image" onerror="this.src='https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'">
        <div class="pet-info">
            <h3 class="pet-name">${pet.name}</h3>
            <div class="pet-details">
                <span>${pet.breed}</span>
                <span>${pet.age}</span>
            </div>
            <p><i class="fas fa-map-marker-alt"></i> ${pet.location}</p>
            <span class="pet-status status-${pet.status}">${formatStatus(pet.status)}</span>
            ${pet.status === 'available' ? 
                `<button class="btn adopt-btn" data-id="${pet.id}">Adopt Me</button>` : 
                ''}
        </div>
    `;
    
    // Add event listener to adopt button
    const adoptBtn = petCard.querySelector('.adopt-btn');
    if (adoptBtn) {
        adoptBtn.addEventListener('click', function() {
            const petId = this.getAttribute('data-id');
            showAdoptionForm(petId);
        });
    }
    
    return petCard;
}

function formatStatus(status) {
    const statusMap = {
        'available': 'Available',
        'adopted': 'Adopted',
        'pending': 'Pending'
    };
    return statusMap[status] || status;
}

function showAdoptionForm(petId) {
    sessionStorage.setItem('selectedPetId', petId);
    window.location.href = 'adopt.html';
}

// Sample data fallback
function getSamplePets() {
    return [
        {
            id: 1,
            name: "Buddy",
            type: "dog",
            breed: "Golden Retriever",
            age: "2 years",
            location: "New York",
            status: "available",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=662&q=80"
        },
        {
            id: 2,
            name: "Luna",
            type: "cat",
            breed: "Siamese",
            age: "1 year",
            location: "Chicago",
            status: "available",
            image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80"
        },
        {
            id: 3,
            name: "Max",
            type: "dog",
            breed: "Beagle",
            age: "3 years",
            location: "Los Angeles",
            status: "adopted",
            image: "https://images.unsplash.com/photo-1576201836106-db1751073e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80"
        }
    ];
}

// Form submission handler
async function handleFormSubmit(formId, endpoint, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading"></div> Submitting...';
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Handle checkbox groups
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.name && !checkbox.name.endsWith('[]')) {
                    data[checkbox.name] = checkbox.checked;
                }
            });
            
            await apiCall(endpoint, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            alert(successMessage);
            form.reset();
            
        } catch (error) {
            alert('There was an error submitting your form. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}