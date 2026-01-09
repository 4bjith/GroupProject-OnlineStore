import React from "react";
import "./homepage.css";
import { Link, NavLink } from "react-router-dom";


const Homepage = () => {
  return (
    <div className="homepage">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">Threads</div>
          <a href="/products">Shop</a>
          <a href="/products">New Arrivals</a>
          <a href="/about">About Us</a>
          
        </div>

        <div className="nav-right">
          <input type="text" placeholder="Search" className="searchbar" />
          <a href="/wishlist">
          <button className="icon-btn">❤️</button>
          </a>
          <a href="/cart">
  <button className="icon-btn">🛒</button>
</a>
          <div className="profile"></div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero-content">
          <h1>New Season Arrivals</h1>
          <p>Discover the latest trends in fashion</p>
          <a href="/products">
          <button className="cta-btn">Shop the Collection</button>
          </a>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          <div className="product-card">
            <img src="https://m.media-amazon.com/images/I/619xMvtqClL._AC_SY400_.jpg" alt="" />
            <p className="title">Modern Linen Shirt</p>
            <p className="price">$49.99</p>
            <a href="/products/1">
            <button>View</button>
            </a>
          </div>
          <div className="product-card">
            <img src="https://m.media-amazon.com/images/I/619xMvtqClL._AC_SY400_.jpg" alt="" />
            <p className="title">Classic Denim Jeans</p>
            <p className="price">$89.99</p>
              <a href="/products/1">
            <button>View</button>
            </a>
          </div>
          <div className="product-card">
            <img src="https://m.media-amazon.com/images/I/619xMvtqClL._AC_SY400_.jpg" alt="" />
            <p className="title">Leather Ankle Boots</p>
            <p className="price">$129.99</p>
              <a href="/products/1">
            <button>View</button>
            </a>
          </div>
          <div className="product-card">
            <img src="https://m.media-amazon.com/images/I/619xMvtqClL._AC_SY400_.jpg" alt="" />
            <p className="title">Minimalist Tote Bag</p>
            <p className="price">$79.99</p>
              <a href="/products/1">
            <button>View</button>
            </a>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <div className="category-card">
            <span>Tops</span>
          </div>
          <div className="category-card">
            <span>Bottoms</span>
          </div>
          <div className="category-card">
            <span>Footwear</span>
          </div>
          <div className="category-card">
            <span>Accessories</span>
          </div>
        </div>
      </section>

      {/* SALE BANNER */}
      <section className="sale-banner">
        <div>
          <h3>Mid-Season Sale</h3>
          <p>Up to 40% Off on selected items.</p>
        </div>
        <button className="view-sale-btn">View Sale</button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-columns">
          <div>
            <h4>Threads</h4>
          </div>

          <div>
            <h5>SHOP</h5>
            <a href="#">Men</a>
            <a href="#">Women</a>
            <a href="#">Accessories</a>
          </div>

          <div>
            <h5>CUSTOMER SERVICE</h5>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
            <a href="#">Shipping & Returns</a>
          </div>

          <div>
            <h5>NEWSLETTER</h5>
            <p>Subscribe to our newsletter to get the latest updates.</p>
            <div className="newsletter-input">
              <input type="text" placeholder="Enter your email" />
              <button>→</button>
            </div>
          </div>
        </div>

        <p className="copyright">
          © 2024 Threads. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;
