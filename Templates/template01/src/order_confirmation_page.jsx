import React from "react";
import "./order_confirmation_page.css";


const OrderConfirmationPage = () => {
  const orderItems = [
    {
      id: 1,
      img: "/images/hoodie.png",
      name: "Essential Hoodie",
      details: "Size: L, Color: Heather Grey, Qty: 1",
      price: "$65.00",
    },
    {
      id: 2,
      img: "/images/tshirt.png",
      name: "Classic Crewneck T-Shirt",
      details: "Size: M, Color: White, Qty: 2",
      price: "$50.00",
    },
    {
      id: 3,
      img: "/images/jeans.png",
      name: "Relaxed Fit Jeans",
      details: "Size: 32×32, Color: Indigo Wash, Qty: 1",
      price: "$75.00",
    },
  ];

  return (
    <div className="order-container">
      <div className="confirmation-icon">✔</div>
      <h1>Thank you for your order!</h1>
      <p className="order-text">
        Your order <b>#123-4567890</b> has been placed. A confirmation email with full details has been
        sent to your email address.
      </p>

      <div className="order-sections">
        {/* Left - Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.img} alt="" />
                <div>
                  <p className="item-title">{item.name}</p>
                  <p className="item-sub">{item.details}</p>
                </div>
                <p className="item-price">{item.price}</p>
              </div>
            ))}
          </div>

          <div className="price-section">
            <div className="price-row"><span>Subtotal</span><span>$190.00</span></div>
            <div className="price-row"><span>Shipping</span><span>$5.00</span></div>
            <div className="price-row"><span>Taxes</span><span>$15.60</span></div>
          </div>

          <div className="total-row">
            <span>Total</span>
            <span>$210.60</span>
          </div>
        </div>

        {/* Right - Shipping & Payment */}
        <div className="side-details">
          <div className="block">
            <h3>Shipping Information</h3>
            <p>Jane Doe</p>
            <p>123 Maple Street</p>
            <p>Anytown, USA 12345</p>
            <p className="delivery"><b>Estimated Delivery:</b> June 25, 2024</p>
          </div>

          <div className="block">
            <h3>Payment Information</h3>
            <p>💳 Visa ending in 1234</p>
            <p><b>$210.60</b></p>
          </div>
        </div>
      </div>

      <div className="bottom-buttons">
        <button className="history-btn">View Order History</button>
        <button className="shop-btn">Continue Shopping</button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
