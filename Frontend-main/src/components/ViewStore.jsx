import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes, FaFilter, FaStore } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col lg:flex-row relative overflow-hidden">
      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 p-4 md:p-8 transition-all duration-300 ${
          isDetailsOpen ? "lg:mr-[400px]" : ""
        } overflow-y-auto h-screen`}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Stores
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your multi-vendor stores.
            </p>
          </div>

          <Link to="/dashboard/stores/add">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 active:scale-95">
              <FaPlus className="text-sm" />
              <span>Add Store</span>
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
              placeholder="Search for stores..."
            />
          </div>
          <button className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors md:block hidden">
            <FaFilter />
          </button>
        </div>

        {/* Store Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {stores.map((store) => (
              <div
                key={store._id}
                onClick={() => handleStoreClick(store)}
                className={`group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden ${
                  selectedStore?._id === store._id ? "ring-2 ring-black" : ""
                }`}
              >
                <div className="relative w-full aspect-video bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  
                  {store.logo?( <img
                    src={
                      store.logo?.startsWith("http")
                        ? store.logo
                        : `http://localhost:3000${store.logo}`
                    }
                    alt="Store Logo"
                  />):(<FaStore className="text-4xl text-gray-300 group-hover:text-black transition-colors duration-500" />)}
                 
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                      {store.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {store.description || "No description provided."}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">
                      {store.currency}
                    </span>
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                        store.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {store.isPublished ? "Published" : "Draft"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL (DETAILS) */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isDetailsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDetails}
      />

      <div
        className={`fixed lg:absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col
          ${
            isDetailsOpen || selectedStore
              ? "translate-x-0"
              : "translate-x-full"
          }
          ${!selectedStore && "lg:hidden"} 
        `}
      >
        {selectedStore && (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Store Details</h2>
              <button
                onClick={closeDetails}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="w-full aspect-video bg-gray-50 rounded-2xl flex justify-center items-center p-8 border border-gray-100">
                <FaStore className="text-6xl text-gray-400" />
              </div>

              <div className="space-y-5">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Store Name
                  </label>
                  <input
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 font-semibold text-gray-900 transition-all"
                    value={selectedStore.name}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Currency
                    </label>
                    <input
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-gray-900 transition-all"
                      value={selectedStore.currency}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Commission
                    </label>
                    <input
                      className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-gray-900 transition-all"
                      value={`${selectedStore.commissionRate}%`}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Owner ID
                  </label>
                  <input
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-sm text-gray-600 transition-all"
                    value={selectedStore.ownerId}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Domain
                  </label>
                  <input
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg p-3 text-sm text-gray-600 transition-all"
                    value={selectedStore.domain || "N/A"}
                    readOnly
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Status</span>
                    <span
                      className={`font-bold ${
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
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() =>
                  navigate(`/dashboard/stores/edit?id=${selectedStore._id}`)
                }
                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg transform active:scale-95"
              >
                Edit Store
              </button>
              <button
                onClick={handleDelete}
                className="w-full mt-2 bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg transform active:scale-95"
              >
                Delete Store
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
