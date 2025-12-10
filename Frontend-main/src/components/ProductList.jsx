import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    "All",
    "Apple Watch",
    "iPhone",
    "Macbook",
    "Apple TV",
    "iPad",
    "Accessories",
    "Earpods",
  ];

  // Dummy data
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Apple Watch Pink",
        price: 120,
        sold: 50924,
        stock: 2345,
        category: "Apple Watch",
        image:"https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-s11-202509_FMT_WHH?wid=296&hei=296&fmt=jpeg&qlt=90&.v=dWNxM2FBcWh6K3lqd1ZDZ0J0SmQzLzRxZ3huVnJIT2RsYmVuZmY3VmJyWVVRZEpaT1dTYTRVRGJYVlZ5a1RjamJGcXNRQnFCV0w3WVRjTExvdm1ic2Zod2h2SXJqUWFnZjgyKzVoUEVRcndXZEdHNUFPR0hYUU12cjI0VlFzM1A",
        description:
          "The Apple Watch is a popular smartwatch with health tracking and app capabilities.",
      },
      {
        id: 2,
        name: "Apple Watch Blue",
        price: 126,
        sold: 5093,
        stock: 2059,
        category: "Apple Watch",
        image:"data:image/jpeg;base64,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",
        description: "Beautiful blue watch with fitness tracking.",
      },
      {
        id: 3,
        name: "Apple Watch Orange",
        price: 153,
        sold: 5091,
        stock: 2099,
        category: "Apple Watch",
        image:"data:image/jpeg;base64,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",
        description: "Stunning orange strap smartwatch.",
      },
    ]);
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen bg-white flex p-6 gap-6">

      {/* LEFT SIDE – PRODUCT LIST */}
      <div className="flex-1">

        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>

          <button className="px-5 py-2 border rounded-full font-medium hover:bg-gray-100">
            Add new Product +
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full flex items-center bg-gray-100 px-4 py-2 rounded-full mb-4">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            className="bg-transparent w-full ml-3 outline-none"
            placeholder="Search Products..."
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto py-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                activeCategory === cat
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                selectedProduct?.id === p.id ? "border-green-500" : "border-gray-200"
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-contain mb-3"
              />

              <h3 className="font-semibold text-sm truncate">{p.name}</h3>
              <p className="font-bold text-lg">${p.price}</p>

              <div className="text-xs text-gray-600 mt-1">
                Sold: {p.sold} &nbsp; | &nbsp; Stock: {p.stock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE – EDIT PANEL */}
      {selectedProduct ? (
        <div className="w-[360px] bg-white shadow-xl rounded-2xl p-6 border">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Product</h2>
            <button className="text-gray-500">See full view →</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-4">
            <button className="px-4 py-2 rounded-full border border-green-500 text-green-600">
              Description
            </button>
            <button className="px-4 py-2 rounded-full border hover:bg-gray-100">
              Inventory
            </button>
            <button className="px-4 py-2 rounded-full border hover:bg-gray-100">
              Pricing
            </button>
          </div>

          {/* Image */}
          <div className="w-full h-40 bg-gray-50 rounded-xl flex justify-center items-center mb-4">
            <img
              src={selectedProduct.image}
              className="h-32 object-contain"
              alt=""
            />
          </div>

          {/* Product Form */}
          <div className="space-y-3">

            <div>
              <label className="font-medium">Product Name:</label>
              <input
                className="w-full border rounded-lg p-2 mt-1"
                value={selectedProduct.name}
                readOnly
              />
            </div>

            <div>
              <label className="font-medium">Description:</label>
              <textarea
                className="w-full border rounded-lg p-2 mt-1 h-20"
                value={selectedProduct.description}
                readOnly
              ></textarea>
            </div>

            <div>
              <label className="font-medium">Category:</label>
              <input
                className="w-full border rounded-lg p-2 mt-1"
                value={selectedProduct.category}
                readOnly
              />
            </div>

            <div>
              <label className="font-medium">Price:</label>
              <input
                className="w-full border rounded-lg p-2 mt-1 font-bold"
                value={`$${selectedProduct.price}`}
                readOnly
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Discard
            </button>

            <button className="px-4 py-2 bg-black text-white rounded-lg">
              Update Product
            </button>
          </div>

        </div>
      ):(
        <div className="w-[360px] bg-white shadow-xl rounded-2xl p-6 border animate-pulse">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full h-40 bg-gray-200 rounded-xl flex justify-center items-center mb-4">
        <div className="h-28 w-28 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Form Skeletons */}
      <div className="space-y-5">

        {/* Product Name */}
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Description */}
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-20 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Category */}
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Price */}
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>

    </div>
      )
      }
    </div>
  );
}
