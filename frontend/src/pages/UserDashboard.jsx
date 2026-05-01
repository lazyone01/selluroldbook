import { useEffect, useState } from "react";
import api from "../api/client";
import BookCard from "../components/BookCard";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ search: "", publication: "", minPrice: "", maxPrice: "" });
  const [message, setMessage] = useState("");

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await api.get(`/books?${params.toString()}`);
      setBooks(data.books || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load books.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddToCart = async (bookId) => {
    try {
      await api.post("/cart/add", { bookId, quantity: 1 });
      setMessage("Book added to cart.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  return (
    <section className="container page-section">
      <h2>Book Marketplace</h2>

      <div className="card filters-grid">
        <input
          placeholder="Search by book name"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <input
          placeholder="Filter by publication"
          value={filters.publication}
          onChange={(e) => setFilters((prev) => ({ ...prev, publication: e.target.value }))}
        />
        <input
          placeholder="Min price"
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
        />
        <input
          placeholder="Max price"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
        />
        <button className="btn" onClick={fetchBooks}>
          Apply Filters
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="grid books-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
};

export default UserDashboard;
