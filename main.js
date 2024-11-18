require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;

const wordSchema = new mongoose.Schema({
    _id: String,
    word: String,
});

const Word = mongoose.model('Word', wordSchema);

app.get('/Words', async (req, res) => {
    try {
        const words = await Word.find();
        res.status(200).json(words);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching words' });
    }
});

app.get('/', (req, res) => {
    res.send('API up and running!');
});

db.once('open', () => {
    console.log('MongoDB connected');
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`PORT: ${PORT}`);
});