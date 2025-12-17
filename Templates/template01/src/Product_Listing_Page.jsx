import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Product_Listing_Page.css";

const products = [
  { id: 1, brand: "Nike", name: "Classic Runner", price: 120, oldPrice: 150, sale: true, category: "Sneakers" },
  { id: 2, brand: "Adidas", name: "Urban Walker", price: 95, category: "Running Shoes" },
  { id: 3, brand: "Salomon", name: "Trail Explorer", price: 150, category: "Running Shoes" },
  { id: 4, brand: "Puma", name: "City Sneaker", price: 80, category: "Sneakers" },
  { id: 5, brand: "Vans", name: "Canvas Slip-On", price: 65, category: "Loafers" },
  { id: 6, brand: "Converse", name: "High-Top Trainer", price: 75, category: "Sneakers" },
  { id: 7, brand: "Nike", name: "Air Max Fusion", price: 145, category: "Sneakers" },
  { id: 8, brand: "Timberland", name: "Trail Hiker Boot", price: 190, category: "Boots" },
];

export default function ProductListingPage() {
  const [page, setPage] = useState(1);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyFilters = () => {
    let result = products;

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (minPrice) result = result.filter((p) => p.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseInt(maxPrice));

    setFilteredProducts(result);
  };

  return (
    <>
      {/* NAVBAR (OUTSIDE FLEX) */}
      <nav className="navbar">
        <div className="nav-left">
          <a href="/">
          <div className="logo">Threads</div>
          </a>
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

      {/* PAGE BODY */}
      <div className="product-page-container">
        <div className="product-page-inner">

          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <h4>Category</h4>
              {["Sneakers", "Running Shoes", "Boots", "Loafers"].map((cat) => (
                <label className="checkbox-row" key={cat}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="$ Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="$ Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Brand</h4>
              {["Nike", "Adidas", "Puma", "Converse", "Vans", "Salomon", "Timberland"].map((b) => (
                <label className="checkbox-row" key={b}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => handleBrandChange(b)}
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>

            <button onClick={applyFilters} className="apply-btn">Apply Filters</button>
          </aside>

          {/* Main */}
          <main className="main">
            <div className="header-row">
              <h2>Men's Shoes</h2>
              <select>
                <option>Sort by: Popularity</option>
              </select>
            </div>

            <p className="items-count">
              Showing {filteredProducts.length} items
            </p>

            <div className="product-grid">
              {filteredProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                  {p.sale && <span className="sale-tag">SALE</span>}
                  <div className="img-box"></div>
                  <p className="brand">{p.brand}</p>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="price">
                    ${p.price.toFixed(2)}
                    {p.oldPrice && <span className="old-price">${p.oldPrice.toFixed(2)}</span>}
                  </p>
                  <button className="icon-btn">Expand</button>
                </Link>
              ))}
            </div>

            <div className="pagination">
              <button>{`<`}</button>
              {[1, 2, 3].map((p) => (
                <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <span>…</span>
              <button>10</button>
              <button>{`>`}</button>
            </div>
          </main>

        </div>
      </div>
    </>
  );
}
