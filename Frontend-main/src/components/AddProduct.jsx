import { useRef, useState } from "react";
import { FaArrowLeft, FaCloudUploadAlt, FaTimes, FaPlus } from "react-icons/fa";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AddProduct() {
  // IMAGE STATES
  const [preview, setPreview] = useState([]);           // array of images
  const [imageLink, setImageLink] = useState("");       // url input state

  // OTHER STATES
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  // REFS
  const titleRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const compareAtPriceRef = useRef();
  const stockRef = useRef();
  const stockKeepingUnitRef = useRef();

  // Fetch Store
  const { data: store } = useQuery({
    queryKey: ["store"],
    queryFn: async () => {
      const res = await api.get("/stores");
      return res.data;
    },
  });

  // Create Product
  const newProduct = async () => {
    try {
      const storeId = store?._id;
      const title = titleRef.current?.value;
      const description = descriptionRef.current?.value;
      const price = priceRef.current?.value;
      const compareAtPrice = compareAtPriceRef.current?.value;
      const stock = stockRef.current?.value;
      const stockKeepingUnit = stockKeepingUnitRef.current?.value;

      const images = preview;

      if (!title || !description || !category || !price || !stock) {
        toast.error("Important fields missing");
        return;
      }

      const payload = {
        storeId: "6939203a5843f7eee1ddfd56",
        title,
        description,
        category,
        specifications,
        tags,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        stock: Number(stock),
        stockKeepingUnit,
        images,
      };

      const res = await api.post("/products", payload);

      if (res.data.success) {
        toast.success("Product created successfully");

        // Reset
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        priceRef.current.value = "";
        compareAtPriceRef.current.value = "";
        stockRef.current.value = "";
        stockKeepingUnitRef.current.value = "";
        setPreview([]);
        setCategory("");
        setSpecifications([{ key: "", value: "" }]);
        setTags([]);
        setImageLink("");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("CREATE PRODUCT CLIENT ERROR:", err);
      toast.error(err?.response?.data?.message || "Server error");
    }
  };

  // Upload File Handler
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setPreview((prev) => [...prev, ...newImages]);
  };

  // Add Product Specification
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const removeSpecification = (index) => {
    const updated = specifications.filter((_, i) => i !== index);
    setSpecifications(updated);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to={"/dashboard/products"} className="group flex items-center gap-3 text-gray-600 hover:text-black transition-colors">
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <FaArrowLeft />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          </Link>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link to="/dashboard/products" className="flex-1 sm:flex-none">
              <button className="w-full px-6 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Discard
              </button>
            </Link>
            <button
              onClick={newProduct}
              className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            >
              Save Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  ref={titleRef}
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your product..."
                  ref={descriptionRef}
                  rows="6"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Media</h2>

            <div className="space-y-4">
              {/* Image Grid */}
              {preview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {preview.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={`Preview ${index}`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreview((prev) => prev.filter((_, i) => i !== index));
                          }}
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
                htmlFor="media"
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
                id="media"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
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
                  onClick={() => {
                    if (!imageLink.trim()) return;
                    setPreview((prev) => [...prev, imageLink.trim()]);
                    setImageLink("");
                  }}
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
                    ref={priceRef}
                    placeholder="0.00"
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
                    ref={compareAtPriceRef}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cost per item</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Customers won’t see this</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Inventory</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  ref={stockRef}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  ref={stockKeepingUnitRef}
                  placeholder="e.g. PROD-001"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="space-y-8">

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Status</h2>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer">
              <option value="Active">Active</option>
              <option value="Deactive">Draft</option>
            </select>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Organization</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none cursor-pointer"
                >
                  <option value="">Select category</option>
                  <option value="Mens Shirt">Mens Shirt</option>
                  <option value="T-shirt">T-Shirts</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Press Enter to add"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (!value) return;
                      setTags([...tags, value]);
                      e.target.value = "";
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                        className="hover:text-red-500 transition-colors ml-1"
                      >
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
                onClick={addSpecification}
                className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <FaPlus size={10} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 items-start group">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, "key", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  {specifications.length > 1 && (
                    <button
                      onClick={() => removeSpecification(index)}
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
