const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// اتصال به دیتابیس
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('ERROR: MONGODB_URI is not set in Environment Variables!');
}
mongoose.connect(mongoURI || 'mongodb://localhost:27017/neoMathDB')
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ساخت اسکیما
const dbSchema = new mongoose.Schema({
    id: String,
    data: Object
}, { collection: 'neoMathDB' });

const Database = mongoose.model('Database', dbSchema);

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
        let dbDoc = await Database.findOne({ id: 'main' });
        if (!dbDoc) {
            dbDoc = new Database({ id: 'main', data: defaultDb });
            await dbDoc.save();
            console.log('Default DB created.');
        }
        res.json(dbDoc.data);
    } catch (err) {
        console.error('GET Error:', err);
        res.status(500).json({ error: 'Failed to read database' });
    }
});

app.post('/api/db', async (req, res) => {
    try {
        let dbDoc = await Database.findOne({ id: 'main' });
        if (!dbDoc) {
            dbDoc = new Database({ id: 'main', data: req.body });
        } else {
            dbDoc.data = req.body;
            dbDoc.markModified('data'); // این خط خیلی مهمه برای آپدیت کردن اطلاعات در مونگو
        }
        await dbDoc.save();
        res.json({ success: true });
    } catch (err) {
        console.error('POST Error:', err);
        res.status(500).json({ error: 'Failed to save database' });
    }
});

app.listen(PORT, () => {
    console.log(`Neo Math Server is running on http://localhost:${PORT}`);
});
