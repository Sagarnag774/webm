// Pets page functionality
async function loadPets(filter = 'all') {
    try {
        const pets = await apiCall('/pets');
        currentPets = pets;
        renderPets(pets, filter);
        populatePetSelect(pets);
    } catch (error) {
        console.error('Error loading pets:', error);
        const samplePets = getSamplePets();
        currentPets = samplePets;
        renderPets(samplePets, filter);
        populatePetSelect(samplePets);
    }
}

function renderPets(pets, filter = 'all') {
    const petGrid = document.getElementById('petGrid');
    if (!petGrid) return;
    
    petGrid.innerHTML = '';
    
    const filteredPets = filter === 'all' 
        ? pets 
        : pets.filter(pet => pet.type === filter);
    
    if (filteredPets.length === 0) {
        petGrid.innerHTML = '<div class="no-pets">No pets found matching your criteria. Please try a different filter.</div>';
        return;
    }
    
    filteredPets.forEach(pet => {
        const petCard = createPetCard(pet);
        petGrid.appendChild(petCard);
    });
}

function populatePetSelect(pets) {
    const petInterestSelect = document.getElementById('petInterest');
    if (!petInterestSelect) return;
    
    // Clear existing options except the first one
    while (petInterestSelect.options.length > 1) {
        petInterestSelect.remove(1);
    }
    
    const availablePets = pets.filter(pet => pet.status === 'available');
    availablePets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.id;
        option.textContent = `${pet.name} - ${pet.breed} (${pet.age})`;
        petInterestSelect.appendChild(option);
    });
    
    // Pre-select if there's a stored pet ID
    const selectedPetId = sessionStorage.getItem('selectedPetId');
    if (selectedPetId) {
        petInterestSelect.value = selectedPetId;
        sessionStorage.removeItem('selectedPetId'); // Clear after use
    }
}

function setupPetFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter pets
            const filter = this.getAttribute('data-filter');
            renderPets(currentPets, filter);
        });
    });
}

function initializeAdoptionForm() {
    handleFormSubmit(
        'adoptionForm',
        '/adoptions',
        'Thank you for your adoption application! We will review it and contact you soon.'
    );
    
    setupPetFilters();
}