import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* NAVBAR — EXACT SAME STRUCTURE AS HOMEPAGE */}
      <div className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">Threads</Link>
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="nav-right">
          <input
            type="text"
            className="searchbar"
            placeholder="Search products"
          />
          <Link to="/wishlist">
            <button className="icon-btn">❤️</button>
          </Link>
          <Link to="/cart">
            <button className="icon-btn">🛒</button>
          </Link>
          <div className="profile"></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="about-container">
        <div className="about-hero">
          <h1>About Us</h1>
          <p>
            We design premium products for comfort, durability,
            and modern everyday life. Quality and detail drive
            everything we create.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <h3>Our Mission</h3>
            <p>
              To deliver well-crafted products that balance
              design, performance, and affordability.
            </p>
          </div>

          <div className="about-card">
            <h3>Our Vision</h3>
            <p>
              Building a globally trusted brand through
              consistency, innovation, and care.
            </p>
          </div>

          <div className="about-card">
            <h3>Why Us</h3>
            <p>
              Clean design, premium materials, ethical sourcing,
              and products built to last.
            </p>
          </div>
        </div>

        <div className="about-cta">
          <h2>Made for Everyday Movement</h2>
          <p>
            Discover products crafted to keep up with your
            lifestyle — wherever you go.
          </p>
          <Link to="/products">
            <button className="cta-btn">Shop Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
