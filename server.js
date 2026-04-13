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

  // 👉 Generate insights here
  const insights = generateInsights(data);

  // 👉 Send everything back
  res.json({
    totalVisitors: visitors.size,
    todayVisitors,
    insights
  });
});
});

function generateInsights(data) {
  const clicks = data.filter(e => e.type === "click");

  const clickMap = {};

  clicks.forEach(c => {
    const key = c.text || c.tag;
    clickMap[key] = (clickMap[key] || 0) + 1;
  });

  const sorted = Object.entries(clickMap).sort((a,b) => b[1]-a[1]);

  const topClicked = sorted[0];

  const insights = [];

  if (topClicked) {
    insights.push(`Users are mostly clicking "${topClicked[0]}". Consider placing key actions near it.`);
  }

  if (clicks.length < 10) {
    insights.push("Low interaction detected. Improve call-to-action visibility.");
  }

  return insights;
}

app.listen(3000, () => console.log("Server running on port 3000"));
