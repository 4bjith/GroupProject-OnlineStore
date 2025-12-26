import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiPencilLine, RiMapPinLine } from "react-icons/ri";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

function Profile() {
    const token = authStore((state) => state.token);
    const queryClient = useQueryClient();

    // State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        address: "",
        profilepic: ""
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
                profilepic: userData.profilePic || ""
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

            {/* Personal Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Personal info</h3>
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
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Full name</label>
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
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="font-semibold text-gray-900 p-2 border border-transparent">{formData.email}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Phone</label>
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
                </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Location</h3>
                    <button className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <RiMapPinLine className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition"
                            placeholder="Enter your address"
                        />
                    </div>
                    <button onClick={handleSaveAddress} className="px-6 py-2 bg-indigo-900 text-white font-medium rounded-lg hover:bg-indigo-800 transition shadow-sm whitespace-nowrap">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;