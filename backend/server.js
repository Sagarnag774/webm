const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const petRoutes = require('./routes/pets');
const adoptionRoutes = require('./routes/adoptions');
const volunteerRoutes = require('./routes/volunteers');
const donationRoutes = require('./routes/donations');
const storyRoutes = require('./routes/stories');

// API routes
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/stories', storyRoutes);

// Stats endpoint
app.get('/api/stats', (req, res) => {
    res.json({
        petsRescued: 1250,
        successfulAdoptions: 890,
        volunteers: 156,
        cities: 24
    });
});

// Blog endpoint
app.get('/api/blog', (req, res) => {
    const blogPosts = require('./data/blog.json');
    res.json(blogPosts);
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`PetResQ server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;