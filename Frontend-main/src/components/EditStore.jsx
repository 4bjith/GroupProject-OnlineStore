import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaStore } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from "react-toastify";

export default function EditStore() {
  const [form, setForm] = useState({
    name: "",
    ownerId: "",
    currency: "USD",
    templateId: "",
    commissionRate: "",
    domain: "",
    isPublished: false,
  });

  // 🔑 LOGO STATES
  const [logoType, setLogoType] = useState("none"); // none | file | url
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams.get("id");

  // 🔵 Fetch Store
  const { data, isLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const res = await api.get(`/stores/${storeId}`);
      return res.data;
    },
    enabled: !!storeId,
  });

  // 🔵 Populate Form
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        ownerId: data.ownerId || "",
        currency: data.currency || "USD",
        templateId: data.templateId || "",
        commissionRate: data.commissionRate || "",
        domain: data.domain || "",
        isPublished: data.isPublished || false,
      });

      if (data.logo) {
        setLogoPreview(data.logo);
        setLogoType("none"); // no change yet
      }
    }
  }, [data]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔑 LOGO HANDLERS
  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoType("file");
  };

  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    setLogoUrl(url);
    setLogoPreview(url);
    setLogoType("url");
  };

  // 🔑 SAVE STORE
  const saveStore = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("ownerId", form.ownerId);
      formData.append("currency", form.currency);
      formData.append("templateId", form.templateId);
      formData.append("commissionRate", Number(form.commissionRate));
      formData.append("domain", form.domain);
      formData.append("isPublished", form.isPublished);
      formData.append("slug", data?.slug);

      // LOGO UPDATE
      if (logoType === "file" && logoFile) {
        formData.append("logo", logoFile);
      }

      if (logoType === "url" && logoUrl) {
        formData.append("logoUrl", logoUrl);
      }

      await api.put(`/stores/${storeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Store updated successfully");
    } catch (err) {
      console.error("UPDATE STORE ERROR:", err);
      toast.error(err?.response?.data?.error || "Error updating store");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Store</h1>
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.history.back()}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveStore}
              className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            >
              Save Changes
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
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
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
                value={form.ownerId}
                onChange={(e) => handleChange("ownerId", e.target.value)}
                placeholder="Enter Owner ID"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Domain
              </label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => handleChange("domain", e.target.value)}
                placeholder="e.g. shop.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
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
                  value={form.commissionRate}
                  onChange={(e) => handleChange("commissionRate", e.target.value)}
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
                value={form.templateId}
                onChange={(e) => handleChange("templateId", e.target.value)}
                placeholder="e.g. template_001"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.isPublished ? "Published" : "Draft"}
                onChange={(e) =>
                  handleChange("isPublished", e.target.value === "Published")
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
