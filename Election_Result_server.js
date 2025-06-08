const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// MongoDB URI
const uri = "mongodb+srv://User-devwithme:user-devwithme@api-checkup.it4iz.mongodb.net/official_website_db?retryWrites=true&w=majority";

// Middleware
app.use(cors());
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from /assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

let votesCollection;

// Connect to MongoDB and start server
async function startServer() {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("official_website_db");
    votesCollection = db.collection("votes");

    // Route to render index.ejs
    app.get('/', (req, res) => {
      res.render('index');
    });

    // Route to get vote counts
    app.get('/vote-results', async (req, res) => {
      try {
        const partyA = await votesCollection.countDocuments({ party: "Party A" });
        const partyB = await votesCollection.countDocuments({ party: "Party B" });

        res.json({
          success: true,
          data: {
            "Party A": partyA,
            "Party B": partyB
          }
        });
      } catch (error) {
        console.error("❌ Error fetching vote counts:", error);
        res.status(500).json({ success: false, message: "Error fetching results" });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();
