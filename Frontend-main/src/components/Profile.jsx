import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiPencilLine, RiMapPinLine, RiStore2Line, RiTimeLine, RiShieldCheckLine } from "react-icons/ri";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

function Profile() {
    const token = authStore((state) => state.token);
    const queryClient = useQueryClient();

    // State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        address: "",
        profilepic: "",
        businessType: "Other",
        businessDescription: "",
        accountStatus: "",
        joinedDate: "",
        lastLogin: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch User Data
    const { data: userData } = useQuery({
        queryKey: ["user-settings"],
        queryFn: async () => {
            const res = await api.get("/user/getData", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.user;
        },
        enabled: !!token,
    });

    // Sync data to form
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                number: userData.number || "",
                address: userData.address || "",
                profilepic: userData.profilePic || "",
                businessType: userData.businessType || "Other",
                businessDescription: userData.businessDescription || "",
                accountStatus: userData.accountStatus || "Active",
                joinedDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A",
                lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "First Login"
            });
        }
    }, [userData]);

    // Mutations
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const form = new FormData();
            form.append("name", updatedData.name);
            form.append("email", updatedData.email);
            form.append("number", updatedData.number);
            form.append("address", updatedData.address);
            form.append("businessType", updatedData.businessType);
            form.append("businessDescription", updatedData.businessDescription);

            if (selectedFile) {
                form.append("profilepic", selectedFile);
            }

            const res = await api.put("/user/updateData", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["user-settings"]);
            setIsEditingInfo(false);
        },
        onError: (err) => {
            console.error(err);
        }
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveInfo = () => {
        updateMutation.mutate(formData);
    };

    const handleSaveAddress = () => {
        updateMutation.mutate(formData);
        window.location.reload();
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn pb-20 md:pb-0">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

            {/* Profile Photo */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <img
                        src={previewUrl || (formData.profilepic ? `http://localhost:3000${formData.profilepic}` : "https://via.placeholder.com/150")}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                        <RiPencilLine />
                    </label>
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                </div>
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-800">Upload new photo</h3>
                    <p className="text-sm text-gray-500 mt-1">At least 800x800 px recommended.<br />JPG or PNG is allowed</p>
                </div>
            </div>

            {/* Account Status Badge (Read-only) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <RiShieldCheckLine className="text-2xl text-blue-600" />
                    <div>
                        <h4 className="font-semibold text-gray-800">Account Status</h4>
                        <p className="text-sm text-gray-500">Current standing of your account</p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${formData.accountStatus === 'Active' ? 'bg-green-100 text-green-700' :
                    formData.accountStatus === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {formData.accountStatus}
                </span>
            </div>

            {/* Personal & Business Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Personal & Business Info</h3>
                    {!isEditingInfo ? (
                        <button onClick={() => setIsEditingInfo(true)} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditingInfo(false)} className="px-3 py-1 text-sm text-red-500 bg-red-50 rounded hover:bg-red-100">Cancel</button>
                            <button onClick={handleSaveInfo} className="px-3 py-1 text-sm text-green-600 bg-green-50 rounded hover:bg-green-100">Save</button>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Owner Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Owner Name</label>
                        {isEditingInfo ? (
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                            />
                        ) : (
                            <p className="font-semibold text-gray-900 p-2 border border-transparent">{formData.name}</p>
                        )}
                    </div>

                    {/* Business Type */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-1"><RiStore2Line /> Business Type</label>
                        {isEditingInfo ? (
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition bg-white"
                            >
                                <option value="Retail">Retail</option>
                                <option value="Wholesale">Wholesale</option>
                                <option value="Service">Service</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p className="font-semibold text-gray-900 p-2 border border-transparent">{formData.businessType}</p>
                        )}
                    </div>

                    {/* Email (Read-only usually, or editable) */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="font-semibold text-gray-700 p-2 border border-transparent bg-gray-50 rounded opacity-80 cursor-not-allowed">{formData.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        {isEditingInfo ? (
                            <input
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                            />
                        ) : (
                            <p className="font-semibold text-gray-900 p-2 border border-transparent">{formData.number}</p>
                        )}
                    </div>

                    {/* Business Description - Full Width */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-medium text-gray-500">Business Description / About Store</label>
                        {isEditingInfo ? (
                            <textarea
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                                placeholder="Describe your business..."
                            />
                        ) : (
                            <p className="font-semibold text-gray-900 p-2 border border-transparent">{formData.businessDescription || "No description provided."}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* System Info (Read-only) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><RiTimeLine /> System Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Joined Date</label>
                        <p className="font-mono text-sm text-gray-700 bg-gray-50 p-2 rounded">{formData.joinedDate}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Last Login</label>
                        <p className="font-mono text-sm text-gray-700 bg-gray-50 p-2 rounded">{formData.lastLogin}</p>
                    </div>
                </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Business Address</h3>
                    <button
                        onClick={() => setIsEditingAddress(true)}
                        className="text-sm text-indigo-900 font-medium hover:underline"
                    >
                        Edit
                    </button>
                </div>

                {/* Address Display */}
                {!isEditingAddress ? (
                    <div className="flex items-start gap-3 text-gray-700">
                        <RiMapPinLine className="text-indigo-900 text-xl mt-1" />
                        <p className="leading-relaxed">
                            {formData.address || (
                                <span className="text-gray-400 italic">
                                    No address added yet
                                </span>
                            )}
                        </p>
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <RiMapPinLine className="absolute left-3 top-3 text-gray-400 text-lg" />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-900 focus:ring-4 focus:ring-indigo-50 outline-none transition resize-none"
                                placeholder="Enter your business address"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleSaveAddress}
                                className="px-5 py-2 bg-indigo-900 text-white font-medium rounded-lg hover:bg-indigo-800 transition shadow-sm"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditingAddress(false)}
                                className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Profile;