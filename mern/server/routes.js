const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    return client.db("todosdb").collection("todos");
};

// GET /todos — get all todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
});

// POST /todos — add new todo
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ msg: "error: no todo text found" });
    }

    todo = typeof todo === "string" ? todo.trim() : JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false });

    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id — delete todo
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });
    res.status(200).json(deletedTodo);
});

// PUT /todos/:id — update todo (status or text)
router.put("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const { status, todo } = req.body;

        const updateFields = {};

        if (typeof status === "boolean") {
            updateFields.status = !status; 
        }

        if (typeof todo === "string" && todo.trim() !== "") {
            updateFields.todo = todo.trim();
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: "No valid fields to update" });
        }

        const updatedTodo = await collection.updateOne(
            { _id },
            { $set: updateFields }
        );

        res.status(200).json({ acknowledged: updatedTodo.acknowledged });
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;
