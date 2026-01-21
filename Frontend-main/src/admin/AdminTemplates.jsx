import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiLayout, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUploadCloud, FiImage
} from "react-icons/fi";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

export default function AdminTemplates() {
    const token = authStore(state => state.token);
    const queryClient = useQueryClient();
    const [isWrapperOpen, setIsWrapperOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);

    // Fetch Templates
    const { data: templates = [], isLoading, error } = useQuery({
        queryKey: ['admin-templates'],
        queryFn: async () => {
            try {
                const res = await api.get("/templates", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return res.data.templates || [];
            } catch (err) {
                if (err.response && err.response.status === 404) return [];
                throw err;
            }
        },
        enabled: !!token
    });

    // Delete Template
    const deleteMutation = useMutation({
        mutationFn: async (slug) => {
            await api.delete(`/templates/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-templates']);
        }
    });

    // Create/Update Template
    const saveMutation = useMutation({
        mutationFn: async (formData) => {
            const isEdit = !!editingTemplate;
            const url = isEdit ? `/templates/${editingTemplate.slug}` : "/templates";
            const method = isEdit ? "put" : "post";

            const res = await api[method](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-templates']);
            setIsWrapperOpen(false);
            setEditingTemplate(null);
        }
    });

    const handleDelete = (slug) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            deleteMutation.mutate(slug);
        }
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setIsWrapperOpen(true);
    };

    const handleCreate = () => {
        setEditingTemplate(null);
        setIsWrapperOpen(true);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Store <span className="text-indigo-600">Templates</span>
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Design presets for vendors</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <FiPlus size={14} /> New Template
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates?.map((template, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={template._id}
                        className="group bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col"
                    >
                        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                            {template.previewImage ? (
                                <img
                                    src={template.previewImage.startsWith('http') ? template.previewImage : `http://localhost:3000${template.previewImage}`}
                                    alt={template.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <FiLayout size={40} />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(template)}
                                    className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(template.slug)}
                                    className="p-2 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-black text-slate-800">{template.name}</h3>
                            <div className="text-[10px] font-bold text-slate-400 font-mono mt-0.5 truncate">/{template.slug}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isWrapperOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsWrapperOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden p-6"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                {editingTemplate ? <FiEdit2 className="text-indigo-600" /> : <FiPlus className="text-indigo-600" />}
                                {editingTemplate ? "Edit Template" : "New Template"}
                            </h2>
                            <TemplateForm
                                initialData={editingTemplate}
                                onSubmit={(data) => saveMutation.mutate(data)}
                                onCancel={() => setIsWrapperOpen(false)}
                                isLoading={saveMutation.isPending}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TemplateForm({ initialData, onSubmit, onCancel, isLoading }) {
    const [name, setName] = useState(initialData?.name || "");
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        if (file) formData.append("previewImage", file);

        // If editing and no new file, backend handles it (partial update if we omit? 
        // Logic depends on controller. Assuming simple update.
        // Actually the backend controller code uses upload.single("previewImage").
        // If no file, req.file is undefined.

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Template Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                    placeholder="e.g. Modern Dark"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Preview Image</label>
                <div className="relative group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:bg-slate-100 transition-colors">
                        <FiUploadCloud size={24} className="text-indigo-400" />
                        <span className="text-[11px] font-bold text-slate-500">
                            {file ? file.name : (initialData?.previewImage ? "Change Image" : "Upload Preview")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />}
                    Save
                </button>
            </div>
        </form>
    );
}
