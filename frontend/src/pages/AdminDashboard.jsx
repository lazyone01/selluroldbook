import { useEffect, useState } from "react";
import api from "../api/client";

const AdminDashboard = () => {
  const [data, setData] = useState({ users: [], booksellers: [], books: [], bookings: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await api.get("/admin/overview");
        setData(data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load admin overview.");
      }
    };

    fetchOverview();
  }, []);

  return (
    <section className="container page-section">
      <h2>Admin Dashboard</h2>
      {message && <p className="message">{message}</p>}

      <div className="stats-grid">
        <article className="card stat"><h3>Users</h3><p>{data.users.length}</p></article>
        <article className="card stat"><h3>Booksellers</h3><p>{data.booksellers.length}</p></article>
        <article className="card stat"><h3>Books</h3><p>{data.books.length}</p></article>
        <article className="card stat"><h3>Bookings</h3><p>{data.bookings.length}</p></article>
      </div>

      <h3>Recent Bookings</h3>
      <div className="stack">
        {data.bookings.slice(0, 10).map((booking) => (
          <article key={booking._id} className="card">
            <p>User: {booking.user?.name} ({booking.user?.email})</p>
            <p>Address: {booking.deliveryAddress}</p>
            <p>Total: Rs. {booking.totalPrice}</p>
            <div className="muted">Items:</div>
            {booking.items.map((item, idx) => (
              <p key={`${booking._id}-${idx}`} className="muted">
                {item.bookName} | Seller: {item.seller?.name} ({item.sellerEmail}) | Rs. {item.lineTotal}
              </p>
            ))}
          </article>
        ))}
      </div>

      <h3>All Books</h3>
      <div className="grid books-grid">
        {data.books.map((book) => (
          <article key={book._id} className="card book-card">
            {book.imageUrl && (
              <img
                className="book-image"
                src={`${import.meta.env.VITE_API_ROOT || "http://localhost:5000"}${book.imageUrl}`}
                alt={book.bookName}
              />
            )}
            <div className="book-content">
              <h3>{book.bookName}</h3>
              <p className="muted">{book.publication}</p>
              <p>Condition: {book.condition}</p>
              <p className="price">Rs. {book.price}</p>
              <p className="muted">Seller: {book.seller?.name}</p>
              <p className="muted">{book.seller?.email}</p>
              <p className="muted">Address: {book.seller?.address}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
