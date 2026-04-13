const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const DB_FILE = "data.json";

function readDB() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Track events
app.post("/track", (req, res) => {
  const data = readDB();
  data.push(req.body);
  writeDB(data);
  res.sendStatus(200);
});

// Get analytics
app.get("/analytics", (req, res) => {
  const data = readDB();

  const visitors = new Set();
  const today = new Date().toDateString();

  let todayVisitors = 0;

  data.forEach(event => {
    visitors.add(event.visitorId);

    if (new Date(event.timestamp).toDateString() === today) {
      todayVisitors++;
    }
  });

  res.json({
    totalVisitors: visitors.size,
    todayVisitors
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
