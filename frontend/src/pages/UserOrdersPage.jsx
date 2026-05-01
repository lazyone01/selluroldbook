import { useEffect, useState } from "react";
import api from "../api/client";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data.orders || []);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="container page-section">
      <h2>Order History</h2>
      {message && <p className="message">{message}</p>}

      <div className="stack">
        {orders.map((order) => (
          <article key={order._id} className="card">
            <p>Status: {order.status}</p>
            <p>Total: Rs. {order.totalPrice}</p>
            <p>Delivery Address: {order.deliveryAddress}</p>
            <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default UserOrdersPage;
