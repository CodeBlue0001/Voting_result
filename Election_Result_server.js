const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect(
  'mongodb+srv://User-devwithme:user-devwithme@api-checkup.it4iz.mongodb.net/official_website_db?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static files
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mongoose Schema and Model
const VoteSchema = new mongoose.Schema({
  party: String
}, { collection: 'votes' });

const Vote = mongoose.model('Vote', VoteSchema);

// Default route to render homepage
app.get('/', async (req, res) => {
  try {
    res.render('index'); // Looks for views/index.ejs
  } catch (err) {
    console.error("❌ Error rendering index page:", err);
    res.status(500).send("Error rendering homepage.");
  }
});

// API route to get vote results
app.get('/vote-result', async (req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: "$party",
          total: { $sum: 1 }
        }
      }
    ]);

    // Format results for frontend (optional hardcoded parties)
    const formatted = { "Party A": 0, "Party B": 0 };

    results.forEach(item => {
      if (item._id === "Party A") formatted["Party A"] = item.total;
      if (item._id === "Party B") formatted["Party B"] = item.total;
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("❌ Error fetching vote results:", err);
    res.status(500).json({ success: false, message: "Error fetching vote results" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
