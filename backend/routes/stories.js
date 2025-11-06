const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const storiesFile = path.join(__dirname, '../data/stories.json');

// Get all success stories
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(storiesFile, 'utf8');
        const stories = JSON.parse(data);
        res.json(stories);
    } catch (error) {
        console.error('Error reading stories data:', error);
        res.status(500).json({ error: 'Unable to fetch stories' });
    }
});

module.exports = router;