const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb"). collection("todos");
    return collection;  
}



// GET /todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);
});

// POST /todos
router.post("/todos", async (req, res) => {
    const collection = getCollection(); 
    let { todo } = req.body;

    if(!todo) {
       return res.status(400).json({mssg: "error no todo found"}); 
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({todo, status: false});
    
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });
    
    res.status(201).json(deletedTodo);
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status, todo } = req.body;
  
    const updateFields = {};
  
    // Only set the fields that are provided
    if (typeof status === "boolean") updateFields.status = !status;
    if (typeof todo === "string") updateFields.todo = todo;
  
    // If no valid fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ mssg: "No valid fields to update" });
    }
  
    const updatedTodo = await collection.updateOne(
      { _id },
      { $set: updateFields }
    );
  
    res.status(200).json(updatedTodo);
  });
 
module.exports = router;