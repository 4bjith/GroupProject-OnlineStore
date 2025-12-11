import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // STORE ID
  const storeId = "6939203a5843f7eee1ddfd56";

  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const limit = 12;

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

  // API REQUEST WITH PAGINATION
  const { data, isLoading } = useQuery({
    queryKey: ["products", storeId, page],
    queryFn: async () => {
      const res = await api.get(
        `/product?storeId=${storeId}&page=${page}&limit=${limit}`
      );

      // Normalize API response
      return {
        ...res.data,
        data: res.data.data.map((item) => ({
          id: item._id,
          name: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          stock: item.stock,
          sold: item.sold || 0,
          image: item.images?.[0] || "",
        })),
      };
    },
    keepPreviousData: true,
  });

  // Update products when API loads
  useEffect(() => {
    if (data?.data) setProducts(data.data);
  }, [data]);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen bg-white flex p-6 gap-6">
      {/* LEFT SIDE */}
      <div className="flex-1">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>

          <Link to={"add"}>
            <button className="px-5 py-2 border rounded-full font-medium hover:bg-gray-100">
              Add new Product +
            </button>
          </Link>
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
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                  selectedProduct?.id === p.id
                    ? "border-green-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={p.image}
                  className="w-full h-40 object-contain mb-3"
                />
                <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                <p className="font-bold text-lg">${p.price}</p>
                <div className="text-xs text-gray-600 mt-1">
                  Sold: {p.sold} | Stock: {p.stock}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {page} / {data?.totalPages || 1}
          </span>

          <button
            disabled={page === data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      {selectedProduct && (
        <div className="w-[360px] bg-white shadow-xl rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

          <div className="w-full h-40 bg-gray-50 rounded-xl flex justify-center items-center mb-4">
            <img src={selectedProduct.image} className="h-32 object-contain" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-medium">Product Name:</label>
              <input className="w-full border p-2 mt-1" value={selectedProduct.name} readOnly />
            </div>

            <div>
              <label className="font-medium">Description:</label>
              <textarea className="w-full border p-2 mt-1" value={selectedProduct.description} readOnly />
            </div>

            <div>
              <label className="font-medium">Category:</label>
              <input className="w-full border p-2 mt-1" value={selectedProduct.category} readOnly />
            </div>

            <div>
              <label className="font-medium">Price:</label>
              <input className="w-full border p-2 mt-1 font-bold" value={selectedProduct.price} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
