const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); // ✅ you missed requiring this
const path = require('path');

const app = express();
const PORT = 3000;

const uploadsDir = path.join(__dirname, 'uploads'); // ✅ define uploadsDir

app.use(cors());
app.use(bodyParser.json()); // ✅ fix: was undefined before
app.use('/uploads', express.static(uploadsDir));
app.set('view engine', 'ejs');

// Optional: set views directory if not in root
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(
  'mongodb+srv://User-devwithme:user-devwithme@api-checkup.it4iz.mongodb.net/official_website_db?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

// Schema
const VoteSchema = new mongoose.Schema({
  party: String
}, { collection: 'votes' });

const Vote = mongoose.model('Vote', VoteSchema);

// ✅ Fix: improper closing brace for '/'
app.get('/', async (req, res) => {
  res.render('index'); // ✅ Do NOT include `.js` — should be `index.ejs`
});

// ✅ API: GET vote results
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

    const formatted = { "Party A": 0, "Party B": 0 };

    results.forEach(item => {
      if (item._id === "Party A") formatted["Party A"] = item.total;
      if (item._id === "Party B") formatted["Party B"] = item.total;
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching vote results" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
