import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineRadioButtonChecked } from "react-icons/md";

export default function AddProduct() {
  const [preview, setPreview] = useState(null);
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-6 pb-10 gap-6 bg-gray-50">

      {/* Header */}
      <div className="w-[95%] lg:w-[80%] flex flex-col sm:flex-row justify-between gap-4 bg-gray-100 bg-linear-to-r px-2 py-3">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
          <FaArrowLeft /> Add Product
        </h1>

        <button className="w-full sm:w-auto px-6 py-2 rounded-lg bg-green-500 text-white font-bold">
          Save
        </button>
      </div>

      {/* Main Grid */}
      <div className="w-[95%] lg:w-[80%] grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* Title + Description */}
        <div className="col-span-1 md:col-span-8 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col">
          <label className="text-sm text-gray-600 font-medium">Title</label>
          <input
            type="text"
            placeholder="Product title (eg: Polo shirt)"
            className="w-full border border-gray-300 rounded-md py-2 px-3 mt-2 mb-5 focus:ring-2 focus:ring-gray-300"
          />

          <label className="text-sm text-gray-600 font-medium">Description</label>
          <textarea
            placeholder="Product description"
            rows="7"
            className="mt-2 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-gray-300"
          ></textarea>
        </div>

        {/* Status */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col">
          <label className="text-sm text-gray-700 font-medium">Status</label>
          <select className="border border-gray-300 px-3 py-2 rounded-md mt-2 focus:ring-2 focus:ring-gray-300">
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>

        {/* Product Image */}
        <div className="col-span-1 md:col-span-8 p-5 rounded-lg border border-gray-100 bg-white shadow-md flex flex-col gap-4">
          <span className="text-sm text-gray-700 font-medium">Product Image</span>

          <label
            htmlFor="media"
            className="flex items-center justify-center w-full h-48 sm:h-56 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="preview"
              />
            ) : (
              <div className="flex flex-col items-center">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 118 0m-4-4v8m0 0H5m4 0h6"
                  />
                </svg>
                <p className="text-gray-600 text-sm mt-2">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
            )}
          </label>

          <input
            type="file"
            id="media"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Publishing */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col gap-4">
          <span className="text-sm font-semibold text-gray-700">Publishing</span>

          <h3 className="text-xs text-gray-500 uppercase tracking-wide">Sales Channel</h3>

          <div className="flex items-center gap-2">
            <MdOutlineRadioButtonChecked className="text-green-500" />
            <p className="text-sm text-gray-700">Online Store</p>
          </div>

          <h3 className="text-xs text-gray-500 uppercase tracking-wide mt-2">Market</h3>

          <div className="flex items-center gap-2">
            <MdOutlineRadioButtonChecked className="text-green-500" />
            <p className="text-sm text-gray-700">India, Kerala</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="col-span-1 md:col-span-8 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-600 font-medium">Price</label>
              <input
                type="number"
                placeholder="₹ 0.00"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium">Compare at price</label>
              <input
                type="number"
                placeholder="₹ 0.00"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="border-t my-3"></div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-sm text-gray-600 font-medium">Cost per item</label>
              <input
                type="number"
                placeholder="₹ 0.00"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">Customers won’t see this</p>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-sm text-gray-500">Margin</p>
              <p className="font-medium text-gray-800">–</p>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-sm text-gray-500">Profit</p>
              <p className="font-medium text-gray-800">–</p>
            </div>
          </div>

          <label className="flex items-center gap-2 mt-3">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-gray-700">Charge tax on this product</span>
          </label>
        </div>

        {/* Product Specifications */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Product Specifications</h2>

          {specifications.map((spec, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name (e.g., Material)"
                value={spec.key}
                onChange={(e) => updateSpecification(index, "key", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              />

              <input
                type="text"
                placeholder="Value (e.g., Cotton)"
                value={spec.value}
                onChange={(e) => updateSpecification(index, "value", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          ))}

          <button
            onClick={addSpecification}
            className="mt-2 w-fit px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md border"
          >
            + Add specification
          </button>
        </div>

        {/* Inventory Section */}
        <div className="col-span-1 md:col-span-8 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>

          <label className="text-sm font-medium text-gray-700">Inventory managed by</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full">
            <option>Shopify</option>
            <option>Warehouse</option>
            <option>Internal System</option>
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                placeholder="12345"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Barcode</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-gray-700">Track quantity</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-gray-700">Continue selling when out of stock</span>
          </label>
        </div>

        {/* Organization Section */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg border border-gray-100 bg-white shadow-md flex flex-col gap-3">
          <h1 className="text-lg font-semibold text-gray-800">Organization</h1>

          <label className="text-sm">Product Category</label>
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option>Mens Shirt</option>
            <option>T-Shirts</option>
          </select>

          <label className="text-sm mt-2">Collection</label>
          <input type="text" className="border border-gray-300 rounded-md px-3 py-2" />

          <p className="text-xs text-gray-500">
            Add this product into a collection for better visibility.
          </p>

          <label className="text-sm mt-2">Tags</label>
          <input type="text" className="border border-gray-300 rounded-md px-3 py-2" />
        </div>
      </div>
    </div>
  );
}
