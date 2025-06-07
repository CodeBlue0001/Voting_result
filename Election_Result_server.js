const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

mongoose.connect(
  'mongodb+srv://User-devwithme:user-devwithme@api-checkup.it4iz.mongodb.net/official_website_db?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

const VoteSchema = new mongoose.Schema({
  party: String
}, { collection: 'votes' });

const Vote = mongoose.model('Vote', VoteSchema);

// API: GET vote results
app.get('/vote-results', async (req, res) => {
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
    res.status(500).json({ success: false, message: "Error fetching vote results" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
