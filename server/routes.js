const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");   
const { ObjectId } = require("mongodb"); 

// --- Middleware to check if user is logged in ---
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next(); 
  } else {
    res.status(401).json({ message: "Unauthorized: please login" });
  }
}

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("booksdb").collection("books");
  return collection;
}

//  GET /books
router.get("/books", isAuthenticated, async (req, res) => {
  const collection = getCollection();
  const books = await collection.find({}).toArray(); 
  res.status(200).json(books);
});

// POST /books
router.post("/books", isAuthenticated, async (req, res) => {
  const collection = getCollection();
  let { book, author, category } = req.body;

  if (!book || !author || !category) {
    return res.status(400).json({ mssg: "Book, author, and category are required." });
  }

  const newBook = await collection.insertOne({
    book,
    author,
    category,
    status: false
  });

  res.status(201).json({
    book,
    author,
    category,
    status: false,
    _id: newBook.insertedId
  });
});

// DELETE /books/:id
router.delete("/books/:id", isAuthenticated, async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  const deletedBook = await collection.deleteOne({ _id });

  res.status(200).json(deletedBook);
});

// PUT /books/:id
router.put("/books/:id", isAuthenticated, async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const { status, book, author, category } = req.body;

  const updateData = {};
  if (typeof status === "boolean") updateData.status = !status;
  if (book) updateData.book = book;
  if (author) updateData.author = author;
  if (category) updateData.category = category;

  const updatedBook = await collection.updateOne({ _id }, { $set: updateData });
  res.status(200).json(updatedBook);
});

module.exports = router;
