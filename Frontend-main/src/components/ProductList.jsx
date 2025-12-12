import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes, FaFilter } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // const [categories, setCategory] = useState([])

  // STORE ID
  const storeId = "6939203a5843f7eee1ddfd56";

  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const limit = 12;

  const queryClient = useQueryClient();

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products", storeId, page]);
      closeDetails();
      alert("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    },
  });

  const handleDelete = () => {
    if (selectedProduct && window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  // const {data:cat} = useQuery({
  //   queryKey: ["category"],
  //   queryFn: async () => {
  //     const res = await api.get("/category")
  //     return res.data;
  //   }
  // })

  // useEffect(()=>{
  //   if(cat){
  //     setActiveCategory(cat)
  //   }
  // },cat)

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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };



  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col lg:flex-row relative overflow-hidden">
      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 p-4 md:p-8 transition-all duration-300 ${selectedProduct ? 'lg:mr-[400px]' : ''} overflow-y-auto h-screen`}>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Products</h1>
            <p className="text-gray-500 mt-1">Manage your store inventory efficiently.</p>
          </div>

          <Link to={"add"}>
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 active:scale-95">
              <FaPlus className="text-sm" />
              <span>Add Product</span>
            </button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3 mb-8 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex-1 flex items-center bg-gray-100 px-4 py-3 rounded-xl w-full">
            <FaSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              className="bg-transparent w-full ml-3 outline-none text-gray-700 placeholder-gray-400 font-medium"
              placeholder="Search for products..."
            />
          </div>
          <button className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors md:block hidden">
            <FaFilter />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${activeCategory === cat
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleProductClick(p)}
                className={`group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden ${selectedProduct?.id === p.id ? "ring-2 ring-black" : ""
                  }`}
              >
                <div className="relative w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-gray-300 text-4xl font-bold">?</div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">{p.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">${p.price}</span>
                    <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                      Stock: {p.stock}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-8 mb-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="font-semibold text-gray-900">
            Page {page} of {data?.totalPages || 1}
          </span>

          <button
            disabled={page === data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT PANEL (DETAILS) */}
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isDetailsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDetails}
      />

      {/* Panel */}
      <div
        className={`fixed lg:absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col
          ${isDetailsOpen || selectedProduct ? 'translate-x-0' : 'translate-x-full'}
          ${!selectedProduct && 'lg:hidden'} 
        `}
      >
        {selectedProduct && (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
              <button onClick={closeDetails} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image Preview */}
              <div className="w-full aspect-square bg-gray-50 rounded-2xl flex justify-center items-center p-8 border border-gray-100">
                <img src={selectedProduct.image} className="w-full h-full object-contain drop-shadow-lg" alt={selectedProduct.name} />
              </div>

              {/* Form Fields - Read Only for now as per original */}
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Product Name</label>
                  <input
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 font-semibold text-gray-900 transition-all"
                    value={selectedProduct.name}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-gray-700 min-h-[100px] resize-none transition-all"
                    value={selectedProduct.description}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                    <input
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-gray-900 transition-all"
                      value={selectedProduct.category}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Stock</label>
                    <input
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-gray-900 transition-all"
                      value={selectedProduct.stock}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 pl-8 font-bold text-xl text-gray-900 transition-all"
                      value={selectedProduct.price}
                      readOnly
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Total Sold</span>
                    <span className="font-bold text-gray-900">{selectedProduct.sold} units</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <Link to={`/dashboard/products/edit?id=${selectedProduct.id}`}>
                <button className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg transform active:scale-95">
                  Edit Product
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="w-full mt-2 bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg transform active:scale-95"
              >
                Delete Product
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

