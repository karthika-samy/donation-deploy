const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Donation Schema and Model
const donationSchema = new mongoose.Schema({
    name: String,
    mobileno: Number,
    address: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

// Routes
app.post('/donate', async (req, res) => {
    try {
        const newDonation = new Donation(req.body);
        await newDonation.save();  // Save the donation to MongoDB
        res.status(201).json({ message: 'Donation successful!' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving donation' });
    }
});

app.get('/donations', async (req, res) => {
    try {
        const donations = await Donation.find();  // Fetch all donations from MongoDB
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching donations' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port  ${PORT}`);
});

app.use(express.static('public'));

