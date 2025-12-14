import { useRef, useState } from "react";
import { FaArrowLeft, FaCloudUploadAlt, FaTimes, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AddProduct() {
  // ---------------- IMAGE STATE ----------------
  // { type: "file", file: File, preview: string }
  // { type: "url", url: string, preview: string }
  const [storedImages, setStoredImages] = useState([]);
  const [imageLink, setImageLink] = useState("");

  // ---------------- OTHER STATE ----------------
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  // ---------------- REFS ----------------
  const titleRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const compareAtPriceRef = useRef();
  const stockRef = useRef();
  const skuRef = useRef();

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

  // ---------------- FETCH STORE ----------------
  const { data: store } = useQuery({
    queryKey: ["store"],
    queryFn: async () => {
      const res = await api.get("/stores");
      return res.data;
    },
  });

  // ---------------- CREATE PRODUCT ----------------
  const newProduct = async () => {
    try {
      const title = titleRef.current.value;
      const description = descriptionRef.current.value;
      const price = priceRef.current.value;
      const compareAtPrice = compareAtPriceRef.current.value;
      const stock = stockRef.current.value;
      const sku = skuRef.current.value;

      if (!title || !description || !category || !price || !stock) {
        toast.error("Required fields are missing");
        return;
      }

      const formData = new FormData();

      formData.append("storeId", "6939203a5843f7eee1ddfd56");
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);

      if (compareAtPrice) formData.append("compareAtPrice", compareAtPrice);
      if (sku) formData.append("stockKeepingUnit", sku);

      formData.append("specifications", JSON.stringify(specifications));
      formData.append("tags", JSON.stringify(tags));

      const imageUrls = [];

      storedImages.forEach((img) => {
        if (img.type === "file") {
          // IMPORTANT: field name MUST match multer: upload.array("images")
          formData.append("images", img.file);
        } else {
          imageUrls.push(img.url);
        }
      });

      formData.append("imageUrls", JSON.stringify(imageUrls));

      // ❌ DO NOT set Content-Type manually
      const res = await api.post("/products", formData);

      if (res.data.success) {
        toast.success("Product created successfully");

        // Reset form
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        priceRef.current.value = "";
        compareAtPriceRef.current.value = "";
        stockRef.current.value = "";
        skuRef.current.value = "";
        setStoredImages([]);
        setSpecifications([{ key: "", value: "" }]);
        setCategory("");
        setTags([]);
        setImageLink("");
      }
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      toast.error(err?.response?.data?.message || "Server error");
    }
  };

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      type: "file",
      file,
      preview: URL.createObjectURL(file),
    }));

    setStoredImages((prev) => [...prev, ...mapped]);
  };

  // ---------------- SPECIFICATIONS ----------------
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // ---------------- UI ----------------
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
        <Link to="/dashboard/products" className="flex items-center gap-3">
          <FaArrowLeft /> <h1 className="text-xl font-bold">Add Product</h1>
        </Link>
        <button
          onClick={newProduct}
          className="px-6 py-2 bg-black text-white rounded-lg"
        >
          Save Product
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <input ref={titleRef} placeholder="Title" className="input" />
          <textarea ref={descriptionRef} placeholder="Description" className="input h-32" />

          {/* IMAGES */}
          <input type="file" multiple onChange={handleImageChange} />

          <div className="flex gap-3">
            <input
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              placeholder="Image URL"
              className="input"
            />
            <button
              onClick={() => {
                if (!imageLink) return;
                setStoredImages((prev) => [
                  ...prev,
                  { type: "url", url: imageLink, preview: imageLink },
                ]);
                setImageLink("");
              }}
              className="btn"
            >
              Add URL
            </button>
          </div>

          {/* PRICE & STOCK */}
          <input ref={priceRef} type="number" placeholder="Price" className="input" />
          <input ref={compareAtPriceRef} type="number" placeholder="Compare Price" className="input" />
          <input ref={stockRef} type="number" placeholder="Stock" className="input" />
          <input ref={skuRef} placeholder="SKU" className="input" />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.catname}>
                {cat.catname}
              </option>
            ))}
          </select>

          <input
            placeholder="Press Enter to add tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setTags([...tags, e.target.value]);
                e.target.value = "";
              }
            }}
            className="input"
          />

          {/* SPECIFICATIONS */}
          {specifications.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={spec.key}
                onChange={(e) => updateSpecification(i, "key", e.target.value)}
                placeholder="Key"
                className="input"
              />
              <input
                value={spec.value}
                onChange={(e) => updateSpecification(i, "value", e.target.value)}
                placeholder="Value"
                className="input"
              />
              <button onClick={() => removeSpecification(i)}>
                <FaTimes />
              </button>
            </div>
          ))}
          <button onClick={addSpecification} className="btn">
            <FaPlus /> Add Spec
          </button>
        </div>
      </div>
    </div>
  );
}
