require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectToMongoDB } = require("./database");
const path = require("path");

const app = express();
app.use(express.json());
app.use(bodyParser.json());


app.use(session({
  secret: "myChickenPotPie", 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } 
}));


const USER = { username: "web215user", password: "LetMeIn!" };


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid username or password" });
  }
});


app.get("/check-auth", (req, res) => {
  if (req.session.user) res.json({ loggedIn: true });
  else res.json({ loggedIn: false });
});


app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

const router = require("./routes");
app.use("/api", router);

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
})


const port = process.env.PORT || 1000;

async function startserver() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}
startserver();





