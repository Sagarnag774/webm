const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const adoptionsFile = path.join(__dirname, '../data/adoptions.json');
const petsFile = path.join(__dirname, '../data/pets.json');

// Submit adoption application
router.post('/', async (req, res) => {
    try {
        const adoptionData = {
            id: uuidv4(),
            ...req.body,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Read existing adoptions
        let adoptions = [];
        try {
            const data = await fs.readFile(adoptionsFile, 'utf8');
            adoptions = JSON.parse(data);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        // Update pet status to pending if pet ID is provided
        if (req.body.petInterest) {
            try {
                const petsData = await fs.readFile(petsFile, 'utf8');
                let pets = JSON.parse(petsData);
                const petIndex = pets.findIndex(p => p.id == req.body.petInterest);
                if (petIndex !== -1) {
                    pets[petIndex].status = 'pending';
                    await fs.writeFile(petsFile, JSON.stringify(pets, null, 2));
                }
            } catch (error) {
                console.error('Error updating pet status:', error);
            }
        }

        // Save adoption application
        adoptions.push(adoptionData);
        await fs.writeFile(adoptionsFile, JSON.stringify(adoptions, null, 2));

        res.json({ 
            message: 'Adoption application submitted successfully',
            applicationId: adoptionData.id
        });
    } catch (error) {
        console.error('Error submitting adoption application:', error);
        res.status(500).json({ error: 'Unable to submit application' });
    }
});

// Get all adoption applications (for admin)
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(adoptionsFile, 'utf8');
        const adoptions = JSON.parse(data);
        res.json(adoptions);
    } catch (error) {
        console.error('Error reading adoptions data:', error);
        res.status(500).json({ error: 'Unable to fetch adoptions' });
    }
});

module.exports = router;