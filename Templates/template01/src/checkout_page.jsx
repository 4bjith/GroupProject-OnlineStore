import React from "react";
import "./checkout_page.css";



const CheckoutPage = () => {
  const orderItems = [
    {
      id: 1,
      img: "/images/camera.png",
      name: "Vintage Camera",
      color: "Black",
      price: "$149.99",
      qty: 1,
    },
    {
      id: 2,
      img: "/images/headphones.png",
      name: "Premium Headphones",
      color: "Onyx",
      price: "$89.50",
      qty: 1,
    },
  ];

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">

        {/* LEFT FORM SECTION */}
        <div className="form-section">
          <h2 className="breadcrumb">Shipping / Delivery / Payment / Review</h2>
          <h1>Shipping information</h1>
          <p className="sub-text">Please enter your details below.</p>

          <label>Email address</label>
          <input type="email" placeholder="you@example.com" />

          <div className="two-input">
            <div>
              <label>First name</label>
              <input type="text" placeholder="Enter first name" />
            </div>
            <div>
              <label>Last name</label>
              <input type="text" placeholder="Enter last name" />
            </div>
          </div>

          <label>Address</label>
          <input type="text" placeholder="123 Main Street" />

          <div className="three-input">
            <input type="text" placeholder="City" />
            <input type="text" placeholder="State / Province" />
            <input type="text" placeholder="ZIP / Postal code" />
          </div>

          <div className="actions">
            <button className="back-btn">← Return to Cart</button>
            <button className="next-btn">
              Continue to Delivery →
            </button>
          </div>
        </div>

        {/* RIGHT ORDER SUMMARY */}
        <div className="order-summary-box">
          <h3>Order Summary</h3>

          <div className="summary-items">
            {orderItems.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.img} alt="" />
                <span className="badge">{item.qty}</span>
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-sub">Color: {item.color}</p>
                </div>
                <p className="item-price">{item.price}</p>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <div className="row"><span>Subtotal</span><span>$239.49</span></div>
            <div className="row"><span>Shipping</span><span>$5.00</span></div>
            <div className="row"><span>Taxes</span><span>$19.16</span></div>
          </div>

          <div className="total-row">
            <span>Total</span>
            <span>$263.65</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
