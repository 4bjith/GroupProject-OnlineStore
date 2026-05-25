import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes, FaFilter, FaStore, FaEdit, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient";

export default function ViewStore() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // API REQUEST
  const { data, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await api.get("/stores");
      return res.data;
    },
  });

  // Update stores when API loads
  useEffect(() => {
    if (data) {
      // If data is array (getAllStores usually returns array)
      setStores(Array.isArray(data) ? data : []);
    }
  }, [data]);

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedStore(null), 300);
  };

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (storeId) => {
      await api.delete(`/stores/${storeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stores"]);
      closeDetails();
      alert("Store deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting store:", error);
      alert("Failed to delete store");
    },
  });

  const handleDelete = () => {
    if (
      selectedStore &&
      window.confirm("Are you sure you want to delete this store?")
    ) {
      deleteMutation.mutate(selectedStore._id);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col relative">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stores</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your multi-vendor stores</p>
          </div>

          <Link to="/dashboard/stores/add">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <FaPlus className="text-sm" />
              <span>Add Store</span>
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
                className="bg-transparent w-full ml-2 outline-none text-sm text-gray-700 placeholder-gray-400"
                placeholder="Search stores..."
              />
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <FaFilter size={14} />
            </button>
          </div>
        </div>

        {/* Store Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {stores.map((store) => (
              <div
                key={store._id}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="relative w-full aspect-video bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {store.logo ? (
                    <img
                      src={
                        store.logo?.startsWith("http")
                          ? store.logo
                          : store.logo?.startsWith("/uploads")
                          ? `http://localhost:4000${store.logo}`
                          : store.logo
                      }
                      alt="Store Logo"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <FaStore className="text-2xl text-gray-300" />
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {store.name}
                  </h3>
                  <a
                    href={store.domain ? `https://${store.domain}` : `http://localhost:3000/${store.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-600 hover:underline mb-2"
                  >
                    {store.domain ? store.domain : `/${store.slug}`}
                  </a>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {store.description || "No description provided."}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {store.currency}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded ${store.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {store.status === "active" ? "Published" : "Draft"}
                      </div>
                      <button
                        onClick={() => navigate(`/dashboard/stores/edit?id=${store._id}`)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {isDetailsOpen && selectedStore && (
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
                <h2 className="text-base font-semibold text-gray-900">Store Details</h2>
                <button
                  onClick={closeDetails}
                  className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Store Logo */}
                <div className="w-full aspect-video bg-gray-50 rounded-lg flex items-center justify-center p-4 border border-gray-200">
                  {selectedStore.logo ? (
                    <img
                      src={
                        selectedStore.logo?.startsWith("http")
                          ? selectedStore.logo
                          : selectedStore.logo?.startsWith("/uploads")
                          ? `http://localhost:4000${selectedStore.logo}`
                          : selectedStore.logo
                      }
                      alt="Store Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <FaStore className="text-3xl text-gray-300" />
                  )}
                </div>

                {/* Store Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Store Name</label>
                    <div className="text-sm font-medium text-gray-900">{selectedStore.name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                      <div className="text-sm font-medium text-gray-900">{selectedStore.currency}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Commission</label>
                      <div className="text-sm font-medium text-gray-900">{selectedStore.commissionRate}%</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Owner ID</label>
                    <div className="text-sm text-gray-600 font-mono truncate">{selectedStore.ownerId}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Domain</label>
                    <a
                      href={selectedStore.domain ? `https://${selectedStore.domain}` : `http://localhost:3000/${selectedStore.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block truncate"
                    >
                      {selectedStore.domain ? selectedStore.domain : `http://localhost:3000/${selectedStore.slug}`}
                    </a>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Status</span>
                      <span
                        className={`font-medium ${
                          selectedStore.isPublished
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {selectedStore.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/dashboard/stores/edit?id=${selectedStore._id}`)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
