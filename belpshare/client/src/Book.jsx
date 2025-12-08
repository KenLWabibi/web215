import { useState } from "react";
import { toast } from "react-toastify";


export default function Book({ book, setBooks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bookTitle, setBookTitle] = useState(book.book);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);

  // Toggle bestseller status
  const updateBookStatus = async (bookId, status) => {
    const res = await fetch(`/api/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.acknowledged) {
      setBooks(current =>
        current.map(b => b._id === bookId ? { ...b, status: !b.status } : b)
      );
      toast.info("Bestseller status updated!")
    }
  };

  // Delete book
  const deleteBook = async (bookId) => {
    const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    const json = await res.json();
    if (json.acknowledged) {
      setBooks(current => current.filter(b => b._id !== bookId));
      toast.error("Book deleted!");
    }
  };

  // Confirm delete before actually deleting
  const confirmDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmed) return; // User clicked Cancel

    await deleteBook(book._id);
  };

  // Save edits for book title, author, and category
  const saveEdit = async () => {
    const res = await fetch(`/api/books/${book._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book: bookTitle, author, category }),
    });
    const json = await res.json();
    if (json.acknowledged) {
      setBooks(current =>
        current.map(b =>
          b._id === book._id ? { ...b, book: bookTitle, author, category } : b
        )
      );
      setIsEditing(false);
      toast.success("Book updated!");
    }
  };

  return (
    <div className="book">
      <div>
        {isEditing ? (
          <>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Inspirational">Inspirational</option>
              <option value="Motivational">Motivational</option>
              <option value="Personal Growth">Personal Growth</option>
            </select>
          </>
        ) : (
          <>
            <p><strong>{book.book}</strong></p>
            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
          </>
        )}

        {/* NYT Best Seller section */}
        <div className="book__status-section">
          <span><label>NYT Bestseller:</label></span>
          <button
            className="book__status"
            onClick={() => updateBookStatus(book._id, book.status)}
          >
            {book.status ? "✓" : "☐"}
          </button>
        </div>
      </div>

      <div className="mutations">
        {isEditing ? (
          <>
            <button className="save__book" onClick={saveEdit}>Save</button>
            <button className="canel__book" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit__book" 
          onClick={() => setIsEditing(true)}>Edit</button>
        )}

        <button className="book__delete" 
        onClick={confirmDelete}>Delete</button>
      </div>
    </div>
  );
}
