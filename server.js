const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'db.json');

// ساخت دیتابیس اولیه اگر فایل وجود نداشت
if (!fs.existsSync(DB_FILE)) {
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
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
}

// API برای گرفتن کل دیتابیس (فرانت‌اند این رو می‌خونه)
app.get('/api/db', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        res.json(db);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

// API برای ذخیره کل دیتابیس (فرانت‌اند تغییرات رو اینجا می‌فرسته)
app.post('/api/db', (req, res) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save database' });
    }
});

app.listen(PORT, () => {
    console.log(`Neo Math Server is running on http://localhost:${PORT}`);
});