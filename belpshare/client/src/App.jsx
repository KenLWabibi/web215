import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Book from "./Book";

export default function App() {
  const [books, setBooks] = useState([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");


  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/check-auth", { credentials: "include" });
      const data = await res.json();
      if (data.loggedIn) setIsLoggedIn(true);
    }
    checkAuth();
  }, []);


  useEffect(() => {
    if (!isLoggedIn) return;
    async function getBooks() {
      const res = await fetch("/api/books", { credentials: "include" });
      if (res.status === 200) {
        const data = await res.json();
        setBooks(data);
      }
    }
    getBooks();
  }, [isLoggedIn]);


  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    if (res.status === 200) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };


  const handleLogout = async () => {
    await fetch("/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };


  const addNewBook = async (e) => {
    e.preventDefault();
    if (content.length > 3 && author.length > 1 && category) {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ book: content, author, category }),
      });
      const newBook = await res.json();
      setBooks([...books, newBook]);

      toast.success("Book added!");
      setContent("");
      setAuthor("");
      setCategory("");
    }
  };


  if (!isLoggedIn) {
    return (
      <main className="login-container">
        <div className="login-box">
          <h1 className="title">Belpshare Login</h1>
          <form className="form" onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="form__input"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form__input"
              required
            />
            <div className="form__button-container">
              <button type="submit">Login</button>
            </div>
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
          </form>
          <h2 className="slogan">Your cozy corner on the internet for motivation, inspiration, and personal growth.</h2>
          <div className="hint-box">
            <p><strong>Hint Credentials:</strong></p>
            <p>Username: web215user</p>
            <p>Password: LetMeIn!</p>
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="container">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="header">
        <h1 className="title">Belpshare</h1>
        <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
          Logout
        </button>
      </div>

      <form className="form" onSubmit={addNewBook}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter book title..."
          className="form__input"
          required
        />

        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author's name..."
          className="form__input"
          required
        />

        <div className="radio-container">
          <span className="radio-label">Category:</span>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="category"
                value="Inspirational"
                checked={category === "Inspirational"}
                onChange={(e) => setCategory(e.target.value)}
              />
              Inspirational
            </label>

            <label>
              <input
                type="radio"
                name="category"
                value="Motivational"
                checked={category === "Motivational"}
                onChange={(e) => setCategory(e.target.value)}
              />
              Motivational
            </label>

            <label>
              <input
                type="radio"
                name="category"
                value="Personal Growth"
                checked={category === "Personal Growth"}
                onChange={(e) => setCategory(e.target.value)}
              />
              Personal Growth
            </label>
          </div>
        </div>
        <div className="form__button-container">
          <button type="submit">Add Book</button>
        </div>
      </form>

      <div className="books">
        {books.length > 0 &&
          books.map((book) => (
            <Book key={book._id} book={book} setBooks={setBooks} />
          ))
        }
      </div>
    </main>
  );
}
