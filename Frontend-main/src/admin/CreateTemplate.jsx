import { useState } from "react";
import api from "../api/axiosClient";
import { toast } from "react-toastify";

export default function CreateTemplate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    content: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    author: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text & color inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit template
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.content) {
      toast.error("Template name and content are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("content", form.content);
      formData.append("primaryColor", form.primaryColor);
      formData.append("secondaryColor", form.secondaryColor);
      formData.append("author", form.author);

      if (imageFile) {
        formData.append("previewImage", imageFile);
      }

      const res = await api.post("/templates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Template created successfully");

      // Reset
      setForm({
        name: "",
        description: "",
        content: "",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        author: "",
      });
      setImageFile(null);
      setPreview(null);

      console.log("Created Template:", res.data.template);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create template"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
          Create Template
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Template Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              placeholder="Modern Template 001"
            />
          </div>

          {/* Author */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              placeholder="Abhijith"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 min-h-[90px] focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Template Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 min-h-[140px] focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Primary Color
            </label>
            <input
              type="color"
              name="primaryColor"
              value={form.primaryColor}
              onChange={handleChange}
              className="w-full h-11 border rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Secondary Color
            </label>
            <input
              type="color"
              name="secondaryColor"
              value={form.secondaryColor}
              onChange={handleChange}
              className="w-full h-11 border rounded-lg cursor-pointer"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Preview Image
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-black file:text-white
                  hover:file:bg-gray-800"
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Creating Template..." : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
