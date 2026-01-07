import React from "react";
import { Link } from "react-router-dom";
import "./wishlist.css";

function WishlistPage() {
  const wishlistItems = [
    {
      id: 1,
      name: "Premium Headphones",
      price: "$199",
      img: "/images/product1.jpg",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: "$149",
      img: "/images/product2.jpg",
    },
  ];

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div className="wishlist-item" key={item.id}>
              <img src={item.img} alt={item.name} className="wishlist-img" />
              <h3 className="wishlist-name">{item.name}</h3>
              <p className="wishlist-price">{item.price}</p>

              <div className="wishlist-btns">
                <button className="add-cart-btn">Add to Cart</button>
                <button className="remove-btn">Remove</button>
                <Link to={`/product/${item.id}`} className="view-btn">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/products" className="back-shop-btn">
        Back to Shop
      </Link>
    </div>
  );
}

export default WishlistPage;
