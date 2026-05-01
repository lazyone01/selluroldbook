import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0),
    [cart]
  );

  const updateQuantity = async (bookId, quantity) => {
    try {
      const { data } = await api.patch(`/cart/item/${bookId}`, { quantity: Number(quantity) });
      setCart(data.cart);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update cart item.");
    }
  };

  const removeItem = async (bookId) => {
    try {
      const { data } = await api.delete(`/cart/item/${bookId}`);
      setCart(data.cart);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to remove cart item.");
    }
  };

  const placeOrder = async () => {
    try {
      const { data } = await api.post("/cart/checkout", { deliveryAddress });
      setMessage(data.message);
      setDeliveryAddress("");
      fetchCart();
    } catch (error) {
      setMessage(error.response?.data?.message || "Checkout failed.");
    }
  };

  return (
    <section className="container page-section">
      <h2>Your Cart</h2>
      {message && <p className="message">{message}</p>}

      <div className="stack">
        {cart.items.map((item) => (
          <article key={item.book?._id} className="card cart-item">
            <div>
              <h3>{item.book?.bookName}</h3>
              <p className="muted">{item.book?.publication}</p>
              <p>Unit Price: Rs. {item.priceAtAddition}</p>
            </div>

            <div className="actions-row">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.book?._id, e.target.value)}
              />
              <button className="btn danger" onClick={() => removeItem(item.book?._id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="card checkout-box">
        <p>Total: Rs. {total}</p>
        <input
          placeholder="Delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
        />
        <button className="btn" onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </section>
  );
};

export default CartPage;
