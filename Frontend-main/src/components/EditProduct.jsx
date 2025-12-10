import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function EditProduct({ productData, onSave }) {
  const [form, setForm] = useState({
    title: productData?.title || "",
    description: productData?.description || "",
    status: productData?.status || "Active",
    price: productData?.price || "",
    comparePrice: productData?.comparePrice || "",
    costPerItem: productData?.costPerItem || "",
    sku: productData?.sku || "",
    barcode: productData?.barcode || "",
    category: productData?.category || "",
    tags: productData?.tags || "",
    image: productData?.image || null,
    specifications: productData?.specifications || [{ key: "", value: "" }],
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("image", URL.createObjectURL(file));
    }
  };

  const updateSpec = (index, key, value) => {
    const updated = [...form.specifications];
    updated[index][key] = value;
    handleChange("specifications", updated);
  };

  const addSpec = () => {
    handleChange("specifications", [...form.specifications, { key: "", value: "" }]);
  };

  const saveProduct = () => {
    onSave(form);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center pb-20">
      <div className="w-[95%] xl:w-[80%] mt-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaArrowLeft className="text-xl cursor-pointer" />
            <h1 className="text-2xl font-semibold">Edit Product</h1>
          </div>

          <button
            onClick={saveProduct}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
        </div>

        {/* Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="bg-white shadow rounded-xl p-5">
              <label className="font-semibold">Title</label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Product title"
              />

              <label className="font-semibold mt-3 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border rounded-lg p-2 h-28 mt-1"
                placeholder="Product description"
              />
            </div>

            {/* Image Upload */}
            <div className="bg-white shadow rounded-xl  p-5">
              <label className="font-semibold">Product Image</label>

              <div className="mt-3 border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer h-[100px]">
                <input type="file" className="hidden" id="imageUpload" onChange={handleImageUpload} />
                <label htmlFor="imageUpload" className="cursor-pointer">

                  {!form.image ? (
                    <p className="opacity-60">
                      Click to upload or drag & drop PNG/JPG (Max 5MB)
                    </p>
                  ) : (
                    <img
                      src={form.image}
                      className="w-40 h-40 object-cover rounded-lg"
                      alt="Preview"
                    />
                  )}
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white shadow rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-3">Pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label>Compare at price</label>
                  <input
                    type="number"
                    value={form.comparePrice}
                    onChange={(e) => handleChange("comparePrice", e.target.value)}
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label>Cost per item</label>
                  <input
                    type="number"
                    value={form.costPerItem}
                    onChange={(e) => handleChange("costPerItem", e.target.value)}
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" className="w-4 h-4" />
                <p>Charge tax on this product</p>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white shadow rounded-xl p-5">
              <h2 className="font-semibold text-lg mb-3">Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>SKU</label>
                  <input
                    value={form.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="SKU"
                  />
                </div>

                <div>
                  <label>Barcode</label>
                  <input
                    value={form.barcode}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Barcode"
                  />
                </div>
              </div>

              <div className="flex flex-col mt-3 gap-2">
                <label className="flex gap-2 items-center">
                  <input type="checkbox" className="w-4 h-4" /> Track Quantity
                </label>

                <label className="flex gap-2 items-center">
                  <input type="checkbox" className="w-4 h-4" /> Continue selling
                  when out of stock
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-5">

            {/* Status */}
            <div className="bg-white shadow rounded-xl p-5">
              <h2 className="font-semibold mb-2">Status</h2>

              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>

            {/* Specs */}
            <div className="bg-white shadow rounded-xl p-5">
              <h2 className="font-semibold mb-2">Product Specifications</h2>

              {form.specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    value={spec.key}
                    onChange={(e) => updateSpec(index, "key", e.target.value)}
                    className="border rounded-lg p-2"
                    placeholder="Name (Material)"
                  />

                  <input
                    value={spec.value}
                    onChange={(e) => updateSpec(index, "value", e.target.value)}
                    className="border rounded-lg p-2"
                    placeholder="Value (Cotton)"
                  />
                </div>
              ))}

              <button
                onClick={addSpec}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100"
              >
                + Add Specification
              </button>
            </div>

            {/* Category / Tags */}
            <div className="bg-white shadow rounded-xl p-5">
              <h2 className="font-semibold mb-2">Organization</h2>

              <label>Product Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option>Mens Shirt</option>
                <option>Mens Pant</option>
                <option>Womens Wear</option>
              </select>

              <label className="mt-3 block">Tags</label>
              <input
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
                placeholder="Add tags"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
