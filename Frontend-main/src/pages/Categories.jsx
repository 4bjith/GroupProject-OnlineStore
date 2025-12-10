import { useState, useEffect } from 'react';
import {
    MdAdd,
    MdDelete,
    MdEdit,
    MdImage,
    MdLink,
    MdCloudUpload,
    MdCheckCircle,
    MdDeleteForever,
    MdSearch,
    MdFilterList,
    MdCleaningServices,
    MdClose
} from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

function Categories() {
    // Initial dummy data
    const [categories, setCategories] = useState([
        // { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=500&q=60' },
        // { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=60' },
        // { id: 3, name: 'Home & Living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=500&q=60' },
        // { id: 4, name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=60' },
    ]);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        imageType: 'url', // 'url' or 'file'
        imageUrl: '',
        imageFile: null
    });

    const [previewUrl, setPreviewUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Update preview when inputs change
    useEffect(() => {
        if (formData.imageType === 'url') {
            setPreviewUrl(formData.imageUrl);
        } else if (formData.imageFile) {
            const objectUrl = URL.createObjectURL(formData.imageFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl('');
        }
    }, [formData.imageUrl, formData.imageFile, formData.imageType]);

    // Reusable Custom Toast
    // Reusable Custom Toast
    const showToast = (title, message, type = 'success') => {
        const toastConfig = {
            success: {
                icon: <MdCheckCircle className="h-8 w-8 text-green-500" />,
                containerClass: "bg-green-50 border-l-4 border-green-500",
                titleClass: "text-green-800",
                messageClass: "text-green-600",
                position: 'top-right'
            },
            update: {
                icon: <MdCheckCircle className="h-8 w-8 text-blue-500" />,
                containerClass: "bg-blue-50 border-l-4 border-blue-500",
                titleClass: "text-blue-800",
                messageClass: "text-blue-600",
                position: 'top-right'
            },
            delete: {
                icon: <MdDeleteForever className="h-8 w-8 text-red-500" />,
                containerClass: "bg-red-50 border-l-4 border-red-500",
                titleClass: "text-red-800",
                messageClass: "text-red-600",
                position: 'top-right'
            }
        };

        const config = toastConfig[type];

        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} md:w-[30%] md:mr-5 h-[40%] w-[60%] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-10 ${config.containerClass}`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            {config.icon}
                        </div>
                        <div className="ml-3 mt-1 flex-1">
                            <p className={`text-sm font-bold ${config.titleClass}`}>{title}</p>
                            {/* <p className={`mt-1 text-sm ${config.messageClass}`}>{message}</p> */}
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={() => toast.dismiss(t.id)}
                            >
                                <span className="sr-only">Close</span>
                                <MdClose className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ), { position: config.position, duration: 3000 });
    };

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear success message on typing
        if (successMsg) setSuccessMsg('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, imageFile: file }));
        }
    };

    const handleClearForm = () => {
        setFormData({
            id: null,
            name: '',
            imageType: 'url',
            imageUrl: '',
            imageFile: null
        });
        setPreviewUrl('');
        setIsEditing(false);
        setSuccessMsg('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || (!formData.imageUrl && !formData.imageFile)) {
            toast.error("Please fill in all fields");
            return;
        }

        const newCategory = {
            id: isEditing ? formData.id : Date.now(),
            name: formData.name,
            image: previewUrl || 'https://via.placeholder.com/150'
        };

        if (isEditing) {
            setCategories(prev => prev.map(cat => cat.id === newCategory.id ? newCategory : cat));
            showToast('Category Updated', '', 'update');
            setIsEditing(false);
        } else {
            setCategories(prev => [newCategory, ...prev]);
            setSuccessMsg(`"${newCategory.name}" added successfully!`);
            showToast('New Category Added', `${newCategory.name} is now live!`, 'success');
        }

        // Reset Form
        handleClearForm();
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setFormData({
            id: category.id,
            name: category.name,
            imageType: 'url', // Simplified for edit preview
            imageUrl: category.image,
            imageFile: null
        });
        setSuccessMsg('');
        // Scroll to form on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        showToast('Category Deleted', '', 'delete');
        if (isEditing && formData.id === id) {
            handleClearForm();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-slate-800">
            <Toaster />

            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Category Management</h1>
                        <p className="text-slate-400 text-sm mt-1">Organize and manage your product categories.</p>
                    </div>
                    {/* Search/Filter Bar could go here */}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Categories List */}
                    <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

                        {/* List Actions/Header */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-md font-semibold flex items-center gap-2 text-slate-700">
                                <MdFilterList size={22} />
                                All Categories
                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{categories.length}</span>
                            </h2>
                            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                <MdSearch size={22} />
                            </button>
                        </div>

                        {/* Categories Grid - Adjusted for smaller cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="group bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative h-32 overflow-hidden bg-slate-100">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-semibold text-slate-800 text-sm mb-2 truncate" title={category.name}>{category.name}</h3>
                                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                                            <span className="text-[10px] text-slate-400 font-mono">#{category.id}</span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-1.5 rounded-md bg-blue-50 text-blue-400 hover:bg-blue-400 hover:text-white transition-all"
                                                    title="Edit"
                                                >
                                                    <MdEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-1.5 rounded-md bg-red-50 text-red-400 hover:bg-red-400 hover:text-white transition-all"
                                                    title="Delete"
                                                >
                                                    <MdDelete size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {categories.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400">
                                    <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                                        <MdFilterList size={32} />
                                    </div>
                                    <p>No categories found. Add one to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="sticky top-6 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                            <div className={`p-4 border-b ${isEditing ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'} flex justify-between items-center`}>
                                <h2 className={`font-bold ${isEditing ? 'text-amber-700' : 'text-slate-700'} flex items-center gap-2`}>
                                    {isEditing ? <MdEdit /> : <MdAdd />}
                                    {isEditing ? 'Edit Category' : 'Add New Category'}
                                </h2>
                                {isEditing && (
                                    <button onClick={handleClearForm} className="text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wide">
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {/* Success Message Inline (as requested) */}
                            {successMsg && !isEditing && (
                                <div className="mx-6 mt-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm border border-green-200 animate-fadeIn">
                                    <MdCheckCircle size={18} />
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">

                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Summer Collection"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    />
                                </div>

                                {/* Image Source Toggle */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category Image</label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imageType: 'file' }))}
                                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${formData.imageType === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <MdImage size={16} /> Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imageType: 'url' }))}
                                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${formData.imageType === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <MdLink size={16} /> Image URL
                                        </button>
                                    </div>

                                    {/* Inputs based on Toggle */}
                                    {formData.imageType === 'url' ? (
                                        <div className="relative">
                                            <MdLink className="absolute left-3 top-3 text-slate-400" size={20} />
                                            <input
                                                type="url"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative bg-slate-50">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <MdCloudUpload className="mx-auto text-slate-400 mb-2" size={32} />
                                            <p className="text-xs text-slate-500 font-medium">Click to upload or drag & drop</p>
                                        </div>
                                    )}
                                </div>

                                {/* Preview Area */}
                                {previewUrl ? (
                                    <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">Preview</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClearForm}
                                            className="absolute top-2 right-2 bg-white/90 text-slate-600 p-1.5 rounded-full hover:bg-white hover:text-red-500 shadow-sm transition-colors"
                                            title="Discard Image"
                                        >
                                            <MdClose size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                        <MdImage size={24} className="mb-2 opacity-50" />
                                        <span className="text-xs">Image preview will appear here</span>
                                    </div>
                                )}

                                {/* Submit & Discard Buttons */}
                                <div className="space-y-3">
                                    

                                    {(previewUrl || formData.name) && (<>
                                    <button
                                        type="submit"
                                        className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isEditing
                                            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                            }`}
                                    >
                                        {isEditing ? <MdEdit size={20} /> : <MdAdd size={20} />}
                                        {isEditing ? 'Update Category' : 'Add Category'}
                                    </button>
                                        <button
                                            type="button"
                                            onClick={handleClearForm}
                                            className="w-full py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MdCleaningServices size={18} />
                                            Discard / Clear Form
                                        </button>
                                        </>)}
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Categories;
