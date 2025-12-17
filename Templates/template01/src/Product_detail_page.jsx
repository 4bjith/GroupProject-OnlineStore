import React, { useState } from "react";
import { useParams } from "react-router-dom";
import products from "./products";
import "./Product_detail_page.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  // Dynamic fallback images/colors/sizes
  const defaultImages = [
    "https://via.placeholder.com/400x450?text=Product",
    "https://via.placeholder.com/120?text=Angle+1",
    "https://via.placeholder.com/120?text=Angle+2",
    "https://via.placeholder.com/120?text=Angle+3",
  ];

  const defaultColors = ["#000", "#1b4fff", "#aaa"];
  const defaultSizes = ["S", "M", "L", "XL"];

  const images = product.images || defaultImages;
  const colors = product.colors || defaultColors;
  const sizes = product.sizes || defaultSizes;

  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);

  const suggestions = [
    {
      name: "Classic Hoodie",
      price: 45,
      img: "https://via.placeholder.com/200?text=Hoodie",
      color: "Gray",
    },
    {
      name: "Everyday Beanie",
      price: 18,
      img: "https://via.placeholder.com/200?text=Beanie",
      color: "Black",
    },
    {
      name: "Urban Sneakers",
      price: 120,
      img: "https://via.placeholder.com/200?text=Sneakers",
      color: "Red/White",
    },
    {
      name: "Denim Jeans",
      price: 75,
      img: "https://via.placeholder.com/200?text=Jeans",
      color: "Blue Wash",
    },
  ];

  return (
    <div className="product-detail-page">
      {/* Product Section */}
      <div className="product-main">
        <div className="gallery">
          <img src={selectedImg} alt="Main" className="main-img" />

          <div className="thumbs">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImg(img)}
                className={selectedImg === img ? "active" : ""}
              />
            ))}
          </div>
        </div>

        <div className="info">
          <p className="brand">{product.brand}</p>

          <h1>{product.name}</h1>

          <p className="subtext">Premium quality apparel for modern lifestyle.</p>

          <div className="rating">
            ⭐⭐⭐⭐⭐ <span>(121 reviews)</span>
          </div>

          <h2 className="price">${product.price.toFixed(2)}</h2>

          <div className="section">
            <label>Color</label>
            <div className="colors">
              {colors.map((c) => (
                <span
                  key={c}
                  className={`color ${color === c ? "selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="section">
            <label>Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="section">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <div className="actions">
            <button className="add-btn">🛒 Add to Cart</button>
            <button className="fav-btn">❤️</button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="description">
        <h3>Product Description</h3>
        <p>
          This product is part of our premium-quality collection
          designed for comfort, durability, and style. Ideal for
          everyday wear and crafted with attention to detail.
        </p>
      </div>

      {/* Recommendations */}
      <div className="suggestions">
        <h3>You Might Also Like</h3>
        <div className="suggest-grid">
          {suggestions.map((item, idx) => (
            <div className="s-item" key={idx}>
              <img src={item.img} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.color}</p>
              <strong>${item.price.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
