const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const volunteersFile = path.join(__dirname, '../data/volunteers.json');

// Submit volunteer application
router.post('/', async (req, res) => {
    try {
        const volunteerData = {
            id: uuidv4(),
            ...req.body,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Read existing volunteers
        let volunteers = [];
        try {
            const data = await fs.readFile(volunteersFile, 'utf8');
            volunteers = JSON.parse(data);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        // Save volunteer application
        volunteers.push(volunteerData);
        await fs.writeFile(volunteersFile, JSON.stringify(volunteers, null, 2));

        res.json({ 
            message: 'Volunteer application submitted successfully',
            applicationId: volunteerData.id
        });
    } catch (error) {
        console.error('Error submitting volunteer application:', error);
        res.status(500).json({ error: 'Unable to submit application' });
    }
});

module.exports = router;