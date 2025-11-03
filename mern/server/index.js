require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require("path");

const app = express();
app.use(express.json());

// Load API routes 
const router = require("./routes");
app.use("/api", router);

// Serve React build 
app.use(express.static(path.join(__dirname, "../client/build")));

// Wildcard route 
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const port = process.env.PORT || 4000;

async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}

startServer();
