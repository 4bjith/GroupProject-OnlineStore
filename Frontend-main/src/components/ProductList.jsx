import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes, FaFilter, FaEdit, FaEye, FaSave } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function ProductList() {
  // ---------------- STATE ----------------
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // Auth token
  const token = authStore((state) => state.token);

  // ---------------- USER QUERY ----------------
  useQuery({
    queryKey: ["user"],
    enabled: !!token,
    queryFn: async () => {
      const res = await api.get("/getuserdetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // ---------------- STORES QUERY ----------------
  const { data: storeData } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await api.get("/stores");
      return res.data;
    },
  });

  // Auto-select first store
  useEffect(() => {
    if (storeData?.length && !storeId) {
      setStores(storeData);
      setStoreId(storeData[0]._id); // ✅ DEFAULT STORE
    }
  }, [storeData, storeId]);

  // ---------------- CATEGORY QUERY ----------------
  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/category");
      return res.data;
    },
  });

  useEffect(() => {
    if (categoryData) setCategories(categoryData);
  }, [categoryData]);

  // ---------------- PRODUCTS QUERY ----------------
  const { data, isLoading } = useQuery({
    queryKey: ["products", storeId, page, search],
    enabled: !!storeId,
    keepPreviousData: true,
    queryFn: async () => {
      const res = await api.get(
        `/product?storeId=${storeId}&page=${page}&limit=${limit}&search=${search}`
      );

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
          image: item.images?.[0]
            ? item.images[0].startsWith("/uploads")
              ? `http://localhost:4000${item.images[0]}`
              : item.images[0]
            : "",
        })),
      };
    },
  });

  useEffect(() => {
    if (data?.data) setProducts(data.data);
  }, [data]);

  // ---------------- DELETE MUTATION ----------------
  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products", storeId, page]);
      closeDetails();
      alert("Product deleted successfully");
    },
  });

  // ---------------- UPDATE MUTATION ----------------
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products", storeId, page]);
      setIsEditMode(false);
      closeDetails();
      alert("Product updated successfully");
    },
  });

  const handleDelete = () => {
    if (
      selectedProduct &&
      window.confirm("Are you sure you want to delete this product?")
    ) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  // ---------------- HELPERS ----------------
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditForm({
      title: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
    });
    setIsEditMode(false);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setIsEditMode(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleEditSave = () => {
    updateProductMutation.mutate({
      id: selectedProduct.id,
      data: editForm
    });
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- UI ----------------

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col relative">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your store inventory</p>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Select Store
              </label>
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full md:w-64 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                {stores.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Link to={"add"}>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <FaPlus className="text-sm" />
              <span>Add Product</span>
            </button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400 text-sm" />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent w-full ml-2 outline-none text-sm text-gray-700 placeholder-gray-400"
                placeholder="Search products..."
              />
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <FaFilter size={14} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          <button
            onClick={() => setActiveCategory("All")}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === "All"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.catname)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.catname
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {cat.catname}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleProductClick(p)}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
              >
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="text-gray-300 text-2xl">?</div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white rounded text-xs font-medium text-gray-600 shadow-sm">
                    {p.category}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">${p.price}</span>
                    <div className={`text-xs font-medium px-2 py-1 rounded ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8 mb-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {data?.totalPages || 1}
          </span>

          <button
            disabled={page === data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {isDetailsOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetails}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    title={isEditMode ? "Switch to View" : "Switch to Edit"}
                  >
                    {isEditMode ? <FaEye size={16} /> : <FaEdit size={16} />}
                  </button>
                  <button
                    onClick={closeDetails}
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Product Image */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg p-2 shrink-0 flex items-center justify-center">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} className="w-full h-full object-contain" alt="" />
                    ) : (
                      <div className="text-gray-300 text-xl">?</div>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedProduct.name}</h3>
                    )}
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">{selectedProduct.category}</span>
                  </div>
                </div>

                {/* Product Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-500 mb-1">Price</div>
                    {isEditMode ? (
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="text-base font-semibold text-gray-900">${selectedProduct.price}</div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-500 mb-1">Stock</div>
                    {isEditMode ? (
                      <input
                        type="number"
                        name="stock"
                        value={editForm.stock}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="text-base font-semibold text-gray-900">{selectedProduct.stock}</div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Category</div>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{selectedProduct.category}</div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">Description</div>
                  {isEditMode ? (
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed max-h-[100px] overflow-y-auto">
                      {selectedProduct.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {isEditMode ? (
                    <>
                      <button
                        onClick={handleEditSave}
                        disabled={updateProductMutation.isPending}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaSave size={14} /> {updateProductMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to={`/dashboard/products/edit?id=${selectedProduct.id}`} className="flex-1">
                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <FaEdit size={14} /> Edit
                        </button>
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

