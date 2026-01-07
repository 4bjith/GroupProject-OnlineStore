import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaStore, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import api from "../api/axiosClient";
import authStore from "../AuthStore";
import { BASE_URL } from "../api/urls";

export default function AddStore() {
  const navigate = useNavigate();
  const logoRef = useRef();
  const token = authStore((state) => state.token);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    name: "",
    templateId: "",
    templateSlug: "",
    commissionRate: "",
  });

  const [currency, setCurrency] = useState("USD");
  const [logoType, setLogoType] = useState("file");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  const updateForm = (k, v) =>
    setForm((p) => ({ ...p, [k]: v }));

  /* ---------------- USER ---------------- */
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

  /* ---------------- TEMPLATES ---------------- */
  const { data: templateData } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => (await api.get("/templates")).data,
  });

  /* Auto-select first template */
  useEffect(() => {
    if (templateData?.templates?.length && !form.templateId) {
      const t = templateData.templates[0];
      setForm((p) => ({
        ...p,
        templateId: t._id,
        templateSlug: t.slug,
      }));
    }
  }, [templateData]);

  /* ---------------- LOGO ---------------- */
  const handleLogoFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoPreview(URL.createObjectURL(f));
  };

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    if (!form.name || !form.commissionRate) {
      toast.error("Fill all required fields");
      return;
    }
    if (!form.templateId) {
      toast.error("Select a template");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("ownerId", usr.user._id);
      fd.append("currency", currency);
      fd.append("commissionRate", form.commissionRate);
      fd.append("templateId", form.templateId);

      if (logoType === "file" && logoRef.current?.files?.[0]) {
        fd.append("logo", logoRef.current.files[0]);
      }
      if (logoType === "url" && logoUrl) {
        fd.append("logoUrl", logoUrl);
      }

      await api.post("/stores", fd);
      toast.success("Store created ✨");
      navigate("/dashboard/stores");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-white to-purple-100">
      {/* HEADER */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-gray-700 hover:text-black"
          >
            <FaArrowLeft />
            <span className="font-bold text-lg">Add Store</span>
          </button>

          <button
            onClick={handleCreate}
            className="px-6 py-2.5 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 active:scale-95 transition"
          >
            Create Store
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        {/* STORE INFO */}
        <section className="glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-black/10 rounded-full">
              <FaStore />
            </div>
            <h2 className="text-xl font-bold">Store Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder="Store name"
              className="glass-input"
            />

            <input
              value={usr?.user?._id || ""}
              readOnly
              className="glass-input text-gray-500"
            />

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="glass-input"
            >
              <option>USD ($)</option>
              <option>INR (₹)</option>
              <option>EUR (€)</option>
            </select>

            <input
              type="number"
              value={form.commissionRate}
              onChange={(e) =>
                updateForm("commissionRate", e.target.value)
              }
              placeholder="Commission %"
              className="glass-input"
            />
          </div>
        </section>

        {/* TEMPLATE PICKER */}
        <section className="glass-card">
          <h2 className="text-xl font-bold mb-2">
            Choose Store Template
          </h2>
          <p className="text-gray-600 mb-6">
            Pick a layout that matches your brand
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {templateData?.templates?.map((t) => {
              const active = form.templateId === t._id;
              return (
                <div
                  key={t._id}
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      templateId: t._id,
                      templateSlug: t.slug,
                    }))
                  }
                  className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all
                    ${
                      active
                        ? "ring-2 ring-black scale-[1.03] shadow-2xl"
                        : "hover:scale-[1.02] hover:shadow-xl"
                    }`}
                >
                  <img
                    src={`${BASE_URL}${t.previewImage}`}
                    className="h-40 w-full object-cover"
                  />

                  {active && (
                    <div className="absolute top-2 right-2 bg-black/80 text-white p-2 rounded-full backdrop-blur">
                      <FaCheckCircle />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* LOGO */}
        <section className="glass-card">
          <h2 className="text-xl font-bold mb-4">Store Logo</h2>

          <div className="flex gap-6 mb-4">
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={logoType === "file"}
                onChange={() => setLogoType("file")}
              />
              Upload
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={logoType === "url"}
                onChange={() => setLogoType("url")}
              />
              URL
            </label>
          </div>

          {logoType === "file" && (
            <input
              type="file"
              ref={logoRef}
              onChange={handleLogoFileChange}
            />
          )}

          {logoType === "url" && (
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://logo.png"
              className="glass-input"
            />
          )}

          {logoPreview && (
            <img
              src={logoPreview}
              className="mt-4 h-24 w-24 object-contain rounded-xl bg-white/60 backdrop-blur p-3 shadow-lg"
            />
          )}
        </section>
      </div>

      {/* GLASS STYLES */}
      <style>
        {`
          .glass-card {
            background: rgba(255,255,255,0.55);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-radius: 1.75rem;
            padding: 2rem;
            box-shadow: 0 30px 60px rgba(0,0,0,0.08);
          }

          .glass-input {
            width: 100%;
            padding: 0.9rem 1rem;
            border-radius: 1rem;
            border: none;
            background: rgba(255,255,255,0.65);
            backdrop-filter: blur(10px);
            outline: none;
          }

          .glass-input:focus {
            box-shadow: 0 0 0 2px rgba(0,0,0,0.9);
            background: white;
          }
        `}
      </style>
    </div>
  );
}
