import { useEffect, useState } from "react";
import api from "../api/client";
import BookCard from "../components/BookCard";

const initialForm = {
  bookName: "",
  publication: "",
  condition: "Good condition",
  price: "",
  sellerAddress: "",
    sellerEmail: "",
  image: null,
};

const SellerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchBooks = async () => {
    const { data } = await api.get("/books/seller/mine");
    setBooks(data.books || []);
  };

  const fetchOrders = async () => {
    const { data } = await api.get("/orders/seller");
    setOrders(data.orders || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchBooks(), fetchOrders()]);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load seller data.");
      }
    };

    init();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files?.[0] || null }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitBook = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      if (editingId) {
        await api.put(`/books/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Book updated successfully.");
      } else {
        await api.post("/books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Book added successfully.");
      }

      setForm(initialForm);
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Book save failed.");
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      bookName: book.bookName,
      publication: book.publication,
      condition: book.condition,
      price: String(book.price),
      sellerAddress: book.sellerAddress,
      sellerEmail: book.sellerEmail,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setMessage("Book deleted successfully.");
      fetchBooks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete book.");
    }
  };

  return (
    <section className="container page-section">
      <h2>Bookseller Dashboard</h2>
      {message && <p className="message">{message}</p>}

      <form className="card form-grid" onSubmit={submitBook}>
        <h3>{editingId ? "Update Book" : "Add Book"}</h3>
        <input name="bookName" placeholder="Book Name" value={form.bookName} onChange={handleChange} required />
        <input
          name="publication"
          placeholder="Publication"
          value={form.publication}
          onChange={handleChange}
          required
        />
        <select name="condition" value={form.condition} onChange={handleChange}>
          <option value="Torn">Torn</option>
          <option value="Highlighted heavily">Highlighted heavily</option>
          <option value="Good condition">Good condition</option>
        </select>
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input
          name="sellerAddress"
          placeholder="Seller Address"
          value={form.sellerAddress}
          onChange={handleChange}
          required
        />
        <input
          name="sellerEmail"
          type="email"
          placeholder="Seller Email"
          value={form.sellerEmail}
          onChange={handleChange}
          required
        />
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
        <button className="btn" type="submit">
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <h3>Your Books</h3>
      <div className="grid books-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} sellerMode onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      <h3>Orders Received</h3>
      <div className="stack">
        {orders.map((order) => (
          <article key={order._id} className="card">
            <p>Buyer: {order.user?.name}</p>
            <p>Email: {order.user?.email}</p>
            <p>Address: {order.deliveryAddress}</p>
            <p>Total (your items): Rs. {order.items.reduce((sum, item) => sum + item.lineTotal, 0)}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SellerDashboard;
