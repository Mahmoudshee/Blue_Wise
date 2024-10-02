
const express = require('express');
const json = require('body-parser').json;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config();
const { GenerativeAiClient } = require('@google/generative-ai');

const app = express();

app.use(json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure sessions
app.use(session({
    secret: '2XTTOBCDAp///XcMxshC86BPTS/EzkLkZ5ev2e6rDC4=',
    resave: false,
    saveUninitialized: true
}));

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bluewise', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Define user schemas
const researcherSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const fishermanSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Create our models
const Researcher = mongoose.model('Researcher', researcherSchema);
const Fisherman = mongoose.model('Fisherman', fishermanSchema);

// Dashboard routes
app.use(express.static(path.join(__dirname, 'public')));

// login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Chatbot route
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bot.html'));
});


app.get('/chat2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'final.html'));
});

// signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// researchers dashboard
app.get('/researcher-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Researchers.html'));
});


app.get('',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/proximityCheckLink',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
})

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!role || !['researcher', 'fisherman'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role selected.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (role === 'researcher') {
            user = new Researcher({ username, email, password: hashedPassword });
        } else {
            user = new Fisherman({ username, email, password: hashedPassword });
        }

        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during signup.' });
    }
});




// Serve the fish dashboard (as per your existing code)
app.get('/fish-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/fish.html'));
});

// Existing login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const researcher = await Researcher.findOne({ username });
    const fisherman = await Fisherman.findOne({ username });

    let user = researcher || fisherman;
    let role = researcher ? 'researcher' : 'fisherman';

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { username: user.username, role };
        res.json({ success: true, role });
    } else {
        res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
});



// Logout route
app.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Logout failed.' });
        }
        res.json({ success: true });
    });
});

// Optional: Route to check if user is logged in
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Chatbot route
const chatbotRouter = express.Router();
chatbotRouter.use(cors());

const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generativecontent?key=${process.env.GEMINI_API_KEY}`;

chatbotRouter.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await axios.post(geminiUrl, {
            prompt: {
                text: message
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response:', response.data);

        res.json({ reply: response.data.candidates[0]?.content || 'No response received' });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: error.response?.data?.error || 'Failed to fetch response from Gemini API'
        });
    }
});

app.use('/', chatbotRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

