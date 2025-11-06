const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const donationsFile = path.join(__dirname, '../data/donations.json');

// Submit donation interest
router.post('/', async (req, res) => {
    try {
        const donationData = {
            id: uuidv4(),
            ...req.body,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Read existing donations
        let donations = [];
        try {
            const data = await fs.readFile(donationsFile, 'utf8');
            donations = JSON.parse(data);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        // Save donation interest
        donations.push(donationData);
        await fs.writeFile(donationsFile, JSON.stringify(donations, null, 2));

        res.json({ 
            message: 'Donation interest submitted successfully',
            donationId: donationData.id
        });
    } catch (error) {
        console.error('Error submitting donation interest:', error);
        res.status(500).json({ error: 'Unable to submit donation interest' });
    }
});

module.exports = router;