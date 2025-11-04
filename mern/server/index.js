require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");

const app = express();
app.use(express.json());

// Load API routes 
const router = require("./routes");
app.use("/api", router);


app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

const port = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
