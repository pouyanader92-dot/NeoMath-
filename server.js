const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const DB_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const defaultDb = {
    users: [
        {username:'سارا',password:'1234',score:320,gamesPlayed:8,correctTotal:52,library:['ch3_s'],registeredAt:Date.now()-86400000*5,subscription:'free',lastDaily:Date.now()-86400000*2,streak:0,wrongTopics:['geometry']},
        {username:'محمد',password:'1234',score:280,gamesPlayed:6,correctTotal:45,library:['ch4_s'],registeredAt:Date.now()-86400000*4,subscription:'eco',lastDaily:Date.now()-86400000,streak:3,wrongTopics:[]},
        {username:'زهرا',password:'1234',score:210,gamesPlayed:5,correctTotal:34,library:['ch5_s'],registeredAt:Date.now()-86400000*3,subscription:'free',lastDaily:0,streak:0,wrongTopics:['algebra']},
        {username:'امیر',password:'1234',score:150,gamesPlayed:4,correctTotal:22,library:[],registeredAt:Date.now()-86400000*2,subscription:'free',lastDaily:0,streak:0,wrongTopics:[]},
        {username:'نازنین',password:'1234',score:90,gamesPlayed:2,correctTotal:14,library:['ch6_s'],registeredAt:Date.now()-86400000,subscription:'plus',lastDaily:Date.now()-43200000,streak:5,wrongTopics:[]}
    ],
    totalGames: 25,
    totalQuestions: 167,
    messages: [],
    announcements: [
        {id:'a1', text:'به مسابقات نئو ریاضی خوش آمدید! بازی کنید و امتیاز جمع کنید.', date:Date.now()-86400000*3}
    ],
    teacherPassword: 'teacher123'
};

app.get('/api/db', async (req, res) => {
    try {
        const response = await fetch(DB_URL + '/latest', {
            headers: { 'X-Master-Key': API_KEY }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        res.json(data.record);
    } catch (err) {
        console.error('GET Error, returning default DB:', err.message);
        res.json(defaultDb);
    }
});

app.post('/api/db', async (req, res) => {
    try {
        const response = await fetch(DB_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(req.body)
        });
        if (!response.ok) throw new Error('Failed to save');
        res.json({ success: true });
    } catch (err) {
        console.error('POST Error:', err.message);
        res.status(500).json({ error: 'Failed to save database' });
    }
});

app.listen(PORT, () => {
    console.log(`Neo Math Server is running on http://localhost:${PORT}`);
});
