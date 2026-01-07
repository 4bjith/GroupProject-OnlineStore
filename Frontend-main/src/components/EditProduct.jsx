import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaCloudUploadAlt, FaTimes, FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from 'react-toastify'

export default function EditProduct({ productData, onSave }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("id");

  // Local state for the product form
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Active",
    price: "",
    comparePrice: "",
    sku: "",
    stock: "",
    category: "",
    tags: [],
    specifications: [{ key: "", value: "" }],
  });

  // storedImages tracks both existing remote URLs and new local Files
  // { type: 'url', url: '...', preview: '...' }
  // { type: 'file', file: File, preview: 'blob:...' }
  const [storedImages, setStoredImages] = useState([]);
  const [imageLink, setImageLink] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Fetch product data if ID exists
  const { data, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });

  // ---------------- CATEGORY FETCH ----------------
  const [categories, setCategories] = useState([]);

  const { data: catData } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await api.get("/category");
      return res.data;
    },
  });

  useEffect(() => {
    if (catData) {
      setCategories(catData);
    }
  }, [catData]);

  // Initialize form when data loads
  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description || "",
        status: data.isActive ? "Active" : "Draft",
        price: data.price || "",
        comparePrice: data.compareAtPrice || "",
        sku: data.stockKeepingUnit || "",
        stock: data.stock || 0,
        category: data.category || "",
        tags: data.tags || [],
        specifications: (data.specifications && data.specifications.length > 0)
          ? data.specifications
          : [{ key: "", value: "" }],
      });


      // Map existing images to storedImages format
      if (data.images && Array.isArray(data.images)) {
        setStoredImages(data.images.map(url => ({
          type: 'url',
          url: url,
          preview: url
        })));
      }
    }
  }, [data]);

  // Handle Input Changes
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------- IMAGES ----------------
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const newImages = files.map((file) => ({
      type: 'file',
      file: file,
      preview: URL.createObjectURL(file)
    }));

    setStoredImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setStoredImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (!imageLink.trim()) return;
    setStoredImages(prev => [...prev, {
      type: 'url',
      url: imageLink.trim(),
      preview: imageLink.trim()
    }]);
    setImageLink("");
  }

  // ---------------- SPECS ----------------
  const updateSpec = (index, key, value) => {
    const updated = [...form.specifications];
    updated[index][key] = value;
    handleChange("specifications", updated);
  };

  const addSpec = () => {
    handleChange("specifications", [...form.specifications, { key: "", value: "" }]);
  };

  const removeSpec = (index) => {
    const updated = form.specifications.filter((_, i) => i !== index);
    handleChange("specifications", updated);
  };

  // ---------------- TAGS ----------------
  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();
      if (!value) return;
      handleChange("tags", [...(form.tags || []), value]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    handleChange("tags", form.tags.filter((_, i) => i !== index));
  };


  // ---------------- SAVE ----------------
  const saveProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("isActive", form.status === "Active");

      if (form.comparePrice) formData.append("compareAtPrice", form.comparePrice);
      if (form.sku) formData.append("stockKeepingUnit", form.sku);
      if (data?.market) formData.append("market", data.market); // preserve

      // JSON fields
      formData.append("specifications", JSON.stringify(form.specifications));
      formData.append("tags", JSON.stringify(form.tags));

      // Images
      const imageUrls = [];
      storedImages.forEach(img => {
        if (img.type === 'file') {
          formData.append('images', img.file);
        } else {
          imageUrls.push(img.url);
        }
      });
      formData.append("imageUrls", JSON.stringify(imageUrls));

      await api.put(`/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Product updated successfully");

      // Invalidate query to refetch fresh data
      queryClient.invalidateQueries(["product", productId]);

      if (onSave) onSave();
      else navigate(-1); // Go back

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error updating product");
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading product...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-gray-600 hover:text-black transition-colors cursor-pointer" onClick={() => navigate(-1)}>
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <FaArrowLeft />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveProduct}
              className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  placeholder="Product title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none h-32"
                  placeholder="Product description"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Media</h2>

            <div className="space-y-4">
              {/* Image Grid */}
              {storedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {storedImages.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={img.preview.startsWith("/uploads") ? `http://localhost:3000${img.preview}` : img.preview}
                        className="w-full h-full object-cover"
                        alt={`Product ${index}`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-white rounded-full text-red-500 hover:text-red-600 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all group"
              >
                <div className="p-4 rounded-full bg-gray-100 group-hover:bg-white transition-colors mb-3">
                  <FaCloudUploadAlt className="text-2xl text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </label>
              <input
                type="file"
                className="hidden"
                id="imageUpload"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
              />

              {/* URL Input */}
              <div className="flex gap-3 pt-2">
                <input
                  type="text"
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  placeholder="Or add image via URL..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
                />
                <button
                  onClick={addImageUrl}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-black transition-colors"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Compare at price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={form.comparePrice}
                    onChange={(e) => handleChange("comparePrice", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKU (Stock Keeping Unit)</label>
                <input
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Status</h2>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer"
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Organization</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.catname}>
                      {cat.catname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Press Enter to add"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.isArray(form.tags) && form.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full">
                      {tag}
                      <button onClick={() => removeTag(idx)} className="hover:text-red-500 transition-colors ml-1">
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Specifications</h2>
              <button
                onClick={addSpec}
                className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <FaPlus size={10} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {form.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 items-start group">
                  <div className="flex-1 space-y-2">
                    <input
                      value={spec.key}
                      onChange={(e) => updateSpec(index, "key", e.target.value)}
                      placeholder="Name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => updateSpec(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  {form.specifications.length > 1 && (
                    <button
                      onClick={() => removeSpec(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-1"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
