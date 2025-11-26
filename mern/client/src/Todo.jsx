import React, { useState } from "react";

export default function Todo(props) {
  const { todo, setTodos } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  
  const API_URL = process.env.REACT_APP_API_URL;

  const updateTodo = async (todoId, todoStatus) => {
    const res = await fetch(`${API_URL}/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ status: todoStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo._id === todoId
            ? { ...currentTodo, status: !currentTodo.status }
            : currentTodo
        )
      );
    }
  };

  const deleteTodo = async (todoId) => {
    const res = await fetch(`${API_URL}/todos/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.acknowledged) {
      setTodos(currentTodos =>
        currentTodos.filter(currentTodo => currentTodo._id !== todoId)
      );
    }
  };

  const editTodo = async (todoId, newText) => {
    const res = await fetch(`${API_URL}/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ todo: newText }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo._id === todoId
            ? { ...currentTodo, todo: newText }
            : currentTodo
        )
      );
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.todo);
  };

  return (
    <div className="todo">
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") editTodo(todo._id, editText);
            if (e.key === "Escape") cancelEdit();
          }}
          autoFocus
        />
      ) : (
        <p>{todo.todo}</p>
      )}

      <div className="mutations">
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "☑︎" : "☐"}
        </button>

        {isEditing ? (
          <>
            <button
              className="todo__save"
              onClick={() => editTodo(todo._id, editText)}
            >
              💾
            </button>
            <button className="todo__cancel" onClick={cancelEdit}>
              ❌
            </button>
          </>
        ) : (
          <button className="todo__edit" onClick={() => setIsEditing(true)}>
            ✏️
          </button>
        )}

        <button
          className="todo__delete"
          onClick={() => deleteTodo(todo._id)}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
