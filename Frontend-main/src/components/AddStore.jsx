import { useRef, useState } from "react";
import { FaArrowLeft, FaStore } from "react-icons/fa";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import authStore from "../AuthStore";

export default function AddStore() {
  const navigate = useNavigate();

  // REFS
  const nameRef = useRef();
  const templateIdRef = useRef(); // Can be text or select
  const commissionRateRef = useRef();
  const logoRef = useRef();

  const [logoType, setLogoType] = useState("file"); // "file" | "url"
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  const [currency, setCurrency] = useState("USD");
  const token = authStore((state) => state.token);

  // Query function to fetch user details
  const { data: usr } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/getuserdetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
  // Create Store
  const createStore = async () => {
    try {
      const name = nameRef.current?.value;
      const ownerId = usr.user?._id;

      const templateId = templateIdRef.current?.value;
      const commissionRate = commissionRateRef.current?.value;
      const logoFile = logoRef.current?.files?.[0];

      if (!name || !ownerId || !commissionRate) {
        toast.error("Please fill all required fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("ownerId", ownerId);
      formData.append("currency", currency);
      formData.append("commissionRate", Number(commissionRate));

      if (templateId) {
        formData.append("templateId", templateId);
      }

      // 🔑 LOGO HANDLING
      if (logoType === "file" && logoFile) {
        formData.append("logo", logoFile); // for multer
      }
      if (logoType === "url" && logoUrl) {
        formData.append("logoUrl", logoUrl);
      }

      const res = await api.post("/stores", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Store created successfully");
        navigate("/dashboard/stores");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error("CREATE STORE ERROR:", err);
      toast.error(err?.response?.data?.error || "Server error");
    }
  };

  // Handle function for logo file format
  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  // Handle function for logo file format
  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    setLogoUrl(url);
    setLogoPreview(url);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 text-gray-600 hover:text-black transition-colors"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <FaArrowLeft />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Add Store</h1>
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.history.back()}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={createStore}
              className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            >
              Create Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              <FaStore className="text-2xl text-gray-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Store Information
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                ref={nameRef}
                placeholder="e.g. My Awesome Shop"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Store Logo
              </label>

              {/* Toggle */}
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={logoType === "file"}
                    onChange={() => setLogoType("file")}
                  />
                  Upload File
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={logoType === "url"}
                    onChange={() => setLogoType("url")}
                  />
                  Use Image URL
                </label>
              </div>

              {/* File Input */}
              {logoType === "file" && (
                <input
                  type="file"
                  accept="image/*"
                  ref={logoRef}
                  onChange={handleLogoFileChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                />
              )}

              {/* URL Input */}
              {logoType === "url" && (
                <input
                  type="text"
                  value={logoUrl}
                  onChange={handleLogoUrlChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                />
              )}

              {/* Preview */}
              {logoPreview && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Preview</p>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-28 w-28 object-contain rounded-xl border bg-white p-2"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Owner ID
              </label>
              <input
                type="text"
                value={usr?.user?._id || ""}
                placeholder="Enter Owner ID"
                readOnly
                className="w-full text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                ID of the user who owns this store.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  ref={commissionRateRef}
                  placeholder="e.g. 10"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Template ID
              </label>
              <input
                type="text"
                ref={templateIdRef}
                placeholder="e.g. template_001"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
