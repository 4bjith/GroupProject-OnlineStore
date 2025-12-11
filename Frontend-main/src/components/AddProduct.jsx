import { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-6 pb-10 gap-6 bg-gray-50">

      {/* Header */}
      <div className="w-[95%] lg:w-[80%] flex flex-col sm:flex-row justify-between gap-4 bg-gray-100 bg-linear-to-r px-2 py-3">
        <Link to={"/dashboard/products"}>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
            <FaArrowLeft /> Add Product
          </h1>
        </Link>

        <button
          onClick={newProduct}
          className="w-full sm:w-auto px-6 py-2 rounded-lg bg-green-500 text-white font-bold"
        >
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
            ref={titleRef}
            placeholder="Product title (eg: Polo shirt)"
            className="w-full border border-gray-300 rounded-md py-2 px-3 mt-2 mb-5 focus:ring-2 focus:ring-gray-300"
          />

          <label className="text-sm text-gray-600 font-medium">Description</label>
          <textarea
            placeholder="Product description"
            ref={descriptionRef}
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
          <span className="text-sm text-gray-700 font-medium">Product Images</span>

          {/* Preview Section */}
          <label
            htmlFor="media"
            className="flex items-center justify-center w-full min-h-48 sm:h-56 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition overflow-hidden p-2"
          >
            {preview.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 w-full">
                {preview.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreview((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white px-2 py-0.5 rounded text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
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
              </div>
            )}
          </label>

          {/* File input */}
          <input
            type="file"
            id="media"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Add Image via URL */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              placeholder="Paste image URL"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={() => {
                if (!imageLink.trim()) return;
                setPreview((prev) => [...prev, imageLink.trim()]);
                setImageLink("");
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </div>

        {/* Publishing */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col gap-4">
          <span className="text-sm font-semibold text-gray-700">Publishing</span>

          <h3 className="text-xs text-gray-500 uppercase tracking-wide">
            Sales Channel
          </h3>

          <div className="flex items-center gap-2">
            <MdOutlineRadioButtonChecked className="text-green-500" />
            <p className="text-sm text-gray-700">Online Store</p>
          </div>

          <h3 className="text-xs text-gray-500 uppercase tracking-wide mt-2">
            Market
          </h3>

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
                ref={priceRef}
                placeholder="₹ 0.00"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium">
                Compare at price
              </label>
              <input
                type="number"
                ref={compareAtPriceRef}
                placeholder="₹ 0.00"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="border-t my-3"></div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Cost per item
              </label>
              <input
                type="number"
                placeholder="₹ 0.00"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Customers won’t see this
              </p>
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
            <span className="text-sm text-gray-700">
              Charge tax on this product
            </span>
          </label>
        </div>

        {/* Product Specifications */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg shadow-md border border-gray-100 bg-white flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Specifications
          </h2>

          {specifications.map((spec, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name (e.g., Material)"
                value={spec.key}
                onChange={(e) =>
                  updateSpecification(index, "key", e.target.value)
                }
                className="border border-gray-300 rounded-md px-3 py-2"
              />

              <input
                type="text"
                placeholder="Value (e.g., Cotton)"
                value={spec.value}
                onChange={(e) =>
                  updateSpecification(index, "value", e.target.value)
                }
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

          <label className="text-sm font-medium text-gray-700">
            Inventory managed by
          </label>
          <select className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full">
            <option>Shopify</option>
            <option>Warehouse</option>
            <option>Internal System</option>
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <input
                type="text"
                ref={stockRef}
                placeholder="12345"
                className="border border-gray-300 rounded-md w-full px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Stock Keeping Unit
              </label>
              <input
                type="text"
                ref={stockKeepingUnitRef}
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
            <span className="text-sm text-gray-700">
              Continue selling when out of stock
            </span>
          </label>
        </div>

        {/* Organization */}
        <div className="col-span-1 md:col-span-4 p-5 rounded-lg border border-gray-100 bg-white shadow-md flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-gray-800">Organization</h1>

          <label className="text-sm">Product Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select category</option>
            <option value="Mens Shirt">Mens Shirt</option>
            <option value="T-shirt">T-Shirts</option>
          </select>

          <label className="text-sm mt-2">Collection</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2"
          />

          <p className="text-xs text-gray-500">
            Add this product into a collection for better visibility.
          </p>

          <label className="text-sm mt-2">Tags</label>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = e.target.value.trim();
                if (!value) return;
                setTags([...tags, value]);
                e.target.value = "";
              }
            }}
            className="border border-gray-300 rounded-md px-3 py-2"
          />

          <div className="flex flex-wrap w-full gap-3 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 bg-gray-200 text-[0.9rem] px-3 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    setTags(tags.filter((_, i) => i !== idx));
                  }}
                  className="text-red-600 font-bold ml-1 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
