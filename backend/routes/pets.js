const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const petsFile = path.join(__dirname, '../data/pets.json');

// Get all pets
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(petsFile, 'utf8');
        const pets = JSON.parse(data);
        res.json(pets);
    } catch (error) {
        console.error('Error reading pets data:', error);
        res.status(500).json({ error: 'Unable to fetch pets' });
    }
});

// Get pet by ID
router.get('/:id', async (req, res) => {
    try {
        const data = await fs.readFile(petsFile, 'utf8');
        const pets = JSON.parse(data);
        const pet = pets.find(p => p.id == req.params.id);
        
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        
        res.json(pet);
    } catch (error) {
        console.error('Error reading pets data:', error);
        res.status(500).json({ error: 'Unable to fetch pet' });
    }
});

// Update pet status
router.put('/:id', async (req, res) => {
    try {
        const data = await fs.readFile(petsFile, 'utf8');
        let pets = JSON.parse(data);
        const petIndex = pets.findIndex(p => p.id == req.params.id);
        
        if (petIndex === -1) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        
        pets[petIndex] = { ...pets[petIndex], ...req.body };
        await fs.writeFile(petsFile, JSON.stringify(pets, null, 2));
        res.json(pets[petIndex]);
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ error: 'Unable to update pet' });
    }
});

module.exports = router;