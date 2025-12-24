import React, { useState } from "react";
import "./Shopping_cart_page.css";


export default function App() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Classic Crewneck T-Shirt",
      size: "Large",
      color: "White",
      price: 50,
      qty: 2,
      img: "https://via.placeholder.com/120x120.png?text=T-Shirt",
    },
    {
      id: 2,
      name: "Slim-Fit Denim Jeans",
      size: "32×32",
      color: "Indigo Wash",
      price: 75,
      qty: 1,
      img: "https://via.placeholder.com/120x120.png?text=Jeans",
    },
  ]);

  const increaseQty = (id) =>
    setCart((c) =>
      c.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );

  const decreaseQty = (id) =>
    setCart((c) =>
      c.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );

  const removeItem = (id) => setCart((c) => c.filter((item) => item.id !== id));

  const subtotal = cart.reduce((t, i) => t + i.price * i.qty, 0);
  const shipping = 10;
  const tax = (subtotal * 0.085).toFixed(2);
  const total = (subtotal + shipping + Number(tax)).toFixed(2);

  return (
    <div className="page">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        {/* LEFT — Products */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.img} alt={item.name} />
              <div className="details">
                <h3>{item.name}</h3>
                <p>
                  Size: {item.size}, Color: {item.color}
                </p>
                <button className="remove" onClick={() => removeItem(item.id)}>
                  🗑 Remove
                </button>
              </div>

              <div className="price">${item.price.toFixed(2)}</div>

              <div className="qty-controls">
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — Summary */}
        <div className="summary">
          <h2>Order Summary</h2>
          <ul>
            <li>
              <span>Subtotal</span> <strong>${subtotal.toFixed(2)}</strong>
            </li>
            <li>
              <span>Shipping</span> <strong>${shipping.toFixed(2)}</strong>
            </li>
            <li>
              <span>Tax</span> <strong>${tax}</strong>
            </li>
          </ul>

          <div className="total">
            <span>Total</span> <strong>${total}</strong>
          </div>

          <p className="promo-label">Have a promo code?</p>
          <div className="promo">
            <input placeholder="Promo Code" />
            <button>Apply</button>
          </div>

          <button className="checkout-btn">Proceed to Checkout</button>
          <div className="secure">🔒 Secure payments</div>
        </div>
      </div>
    </div>
  );
}
