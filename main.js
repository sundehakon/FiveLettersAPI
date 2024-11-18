require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

// API key middleware
app.use((req, res, next) => {
    const apiKey = req.query.api_key;
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
    }
    next();
});

mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;

// Word data schematic
const wordSchema = new mongoose.Schema({
    _id: Number,
    word: String,
}, { collection: 'Words' });

const Word = mongoose.model('Word', wordSchema);

// Endpoint for word collection
app.get('/Words', async (req, res) => {
    try {
        const words = await Word.find();
        res.status(200).json(words);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching words' });
    }
});

// Endpoint for random word
app.get('/Random', async (req, res) => {
    try {
        const randomWord = await Word.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json(randomWord[0]);
    } catch (error) {
        console.error('Error fetching random word:', error);
        res.status(500).json({ message: 'Error fetching random word' });

    }
});

// Home endpoint
app.get('/', (req, res) => {
    res.send('API up and running...');
});

db.once('open', () => {
    console.log('MongoDB connected');
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`PORT: ${PORT}`);
});