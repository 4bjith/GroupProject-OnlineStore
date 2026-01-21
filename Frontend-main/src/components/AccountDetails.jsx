import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    RiBankLine,
    RiShieldCheckLine,
    RiTimeLine,
    RiErrorWarningLine,
    RiQrCodeLine,
    RiPencilLine,
    RiCheckDoubleLine,
    RiEyeLine,
    RiEyeOffLine,
    RiGovernmentLine
} from "react-icons/ri";
import api from "../api/axiosClient";
import authStore from "../AuthStore";
import toast from "react-hot-toast";

const AccountDetails = () => {
    const token = authStore((state) => state.token);
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [showSensitive, setShowSensitive] = useState(false);
    const [showBankSensitive, setShowBankSensitive] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        panNumber: "",
        panName: "",
        aadhaarNumber: "",
        bankName: "",
        accHolderName: "",
        accNumber: "",
        ifsc: "",
        branch: "",
        upiId: ""
    });

    // Fetch Data
    const { data: paymentData, isLoading, isError } = useQuery({
        queryKey: ["payment-details"],
        queryFn: async () => {
            try {
                const res = await api.get("/payment", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return res.data.payment;
            } catch (err) {
                if (err.response && err.response.status === 404) return null;
                throw err;
            }
        },
        enabled: !!token,
        retry: false
    });

    // Sync Data to Form
    useEffect(() => {
        if (paymentData) {
            setFormData({
                panNumber: paymentData.kyc?.pan?.number || "",
                panName: paymentData.kyc?.pan?.holderName || "",
                aadhaarNumber: paymentData.kyc?.aadhaar?.number || "",
                bankName: paymentData.bank?.bankName || "",
                accHolderName: paymentData.bank?.accountHolderName || "",
                accNumber: paymentData.bank?.accountNumber || "",
                ifsc: paymentData.bank?.ifsc || "",
                branch: paymentData.bank?.branch || "",
                upiId: paymentData.upi?.upiId || ""
            });
        }
    }, [paymentData]);

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                kyc: {
                    pan: { number: data.panNumber, holderName: data.panName },
                    aadhaar: { number: data.aadhaarNumber }
                },
                bank: {
                    bankName: data.bankName,
                    accountHolderName: data.accHolderName,
                    accountNumber: data.accNumber,
                    ifsc: data.ifsc,
                    branch: data.branch
                },
                upi: {
                    upiId: data.upiId
                }
            };

            if (!paymentData) {
                return api.post("/payment/create", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                return api.put(`/payment/update/${paymentData.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["payment-details"]);
            setIsEditing(false);
            toast.success("Account details updated successfully");
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to update details");
        }
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-10 text-center">Loading account details...</div>;

    const kycStatus = paymentData?.kyc?.status || "pending";

    // Formatters
    const formatPan = (str) => str ? str.toUpperCase() : "ABCDE1234F";
    const formatAadhaar = (str) => {
        if (!str) return "0000 0000 0000";
        if (showSensitive) return str.replace(/(\d{4})/g, '$1 ').trim();
        return `XXXX XXXX ${str.slice(-4)}`;
    };
    const formatAccNum = (str) => {
        if (!str) return "000000000000";
        if (showBankSensitive) return str;
        return `•••• •••• ${str.slice(-4)}`;
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-20 p-2 md:p-4">

            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Account & Payment Settings</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your KYC documents and payout preferences</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 font-bold shadow-sm text-sm ${kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                    kycStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {kycStatus === 'verified' && <RiShieldCheckLine className="text-lg" />}
                    {kycStatus === 'pending' && <RiTimeLine className="text-lg" />}
                    {kycStatus === 'rejected' && <RiErrorWarningLine className="text-lg" />}
                    <span>KYC {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}</span>
                </div>
            </div>

            {/* Edit Toggle */}
            <div className="flex justify-end">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                >
                    <RiPencilLine /> {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            {/* --- COMPACT CARDS SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* PAN CARD VISUAL */}
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-md border border-blue-200 p-4 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Income Tax Dept</h3>
                            <h2 className="text-[9px] font-bold text-blue-800 uppercase tracking-wide">Govt. of India</h2>
                        </div>
                        <RiGovernmentLine className="text-3xl text-blue-800 opacity-50" />
                    </div>

                    <div className="mt-3 flex gap-3 items-center relative z-10">
                        <div className="w-16 h-20 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-[10px]">
                            Photo
                        </div>
                        <div className="space-y-1 flex-1">
                            <div>
                                <p className="text-[9px] text-blue-700 uppercase">PAN Number</p>
                                {isEditing ? (
                                    <input
                                        name="panNumber"
                                        value={formData.panNumber}
                                        onChange={handleInputChange}
                                        className="font-mono text-base font-bold text-gray-800 bg-white/50 border-b border-blue-400 w-full focus:outline-none uppercase py-0"
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                    />
                                ) : (
                                    <p className="font-mono text-lg font-bold text-gray-800 tracking-wider shadow-blue-glow whitespace-nowrap">{formatPan(formData.panNumber)}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-[9px] text-blue-700 uppercase">Name</p>
                                {isEditing ? (
                                    <input
                                        name="panName"
                                        value={formData.panName}
                                        onChange={handleInputChange}
                                        className="font-sans text-xs font-semibold text-gray-800 bg-white/50 border-b border-blue-400 w-full focus:outline-none uppercase py-0"
                                        placeholder="NAME"
                                    />
                                ) : (
                                    <p className="font-sans text-xs font-semibold text-gray-800 uppercase truncate">{formData.panName || "YOUR NAME HERE"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AADHAAR CARD VISUAL */}
                <div className="w-full h-40 bg-white rounded-xl shadow-md border-t-2 border-orange-500 border-b-2 border-green-600 p-0 relative overflow-hidden flex flex-col">
                    <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="h-6 opacity-80" alt="Emblem" />
                        <div className="flex-1">
                            <h3 className="text-xs font-bold text-gray-800 leading-tight">Govt. of India</h3>
                            <p className="text-[9px] text-gray-500 leading-tight">UIDAI</p>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" className="h-6" alt="Aadhaar" />
                    </div>

                    <div className="flex-1 p-3 flex items-center gap-4 relative">
                        <div className="w-16 h-20 bg-gray-100 rounded border border-gray-200 flex-shrink-0"></div>
                        <div className="flex-1 space-y-2 z-10">
                            <div>
                                <p className="text-[10px] text-gray-500 mb-0.5">Aadhaar No.</p>
                                <div className="flex items-center gap-1">
                                    {isEditing ? (
                                        <input
                                            name="aadhaarNumber"
                                            value={formData.aadhaarNumber}
                                            onChange={handleInputChange}
                                            className="text-lg font-bold text-gray-800 w-full border-b border-orange-200 focus:border-orange-500 outline-none tracking-wide py-0"
                                            placeholder="0000 0000 0000"
                                            maxLength={14}
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-gray-800 tracking-wide">{formatAadhaar(formData.aadhaarNumber)}</p>
                                    )}
                                    <button onClick={() => setShowSensitive(!showSensitive)} className="text-gray-400 hover:text-gray-600">
                                        {showSensitive ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-red-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                <span>Mera Aadhaar, Meri Pehchan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BANK & UPI COMPACT GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* BANK DETAILS */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50 flex items-center gap-2">
                        <RiBankLine className="text-lg text-indigo-900" />
                        <h3 className="text-sm font-bold text-gray-800">Bank Details</h3>
                        {paymentData?.bank?.verified && <RiCheckDoubleLine className="text-green-500 ml-auto text-lg" title="Verified" />}
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                            <label className="text-xs font-medium text-gray-500">Holder Name</label>
                            <input
                                name="accHolderName"
                                value={formData.accHolderName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-2 py-1.5 text-sm rounded border ${isEditing ? 'border-gray-300 bg-white focus:ring-1 focus:ring-indigo-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs font-medium text-gray-500">Bank Name</label>
                            <input
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-2 py-1.5 text-sm rounded border ${isEditing ? 'border-gray-300 bg-white focus:ring-1 focus:ring-indigo-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs font-medium text-gray-500">Account Number</label>
                            <div className="relative flex items-center w-full rounded bg-gray-50 px-2 py-1.5 border border-transparent has-[:focus]:border-indigo-100 has-[:focus]:bg-white">
                                <input
                                    name="accNumber"
                                    value={isEditing ? formData.accNumber : formatAccNum(formData.accNumber)}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    type="text"
                                    className={`w-full bg-transparent outline-none text-sm tracking-mid font-mono
                                               ${isEditing ? 'text-gray-800' : 'text-gray-700'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowBankSensitive(!showBankSensitive)}
                                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showBankSensitive ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs font-medium text-gray-500">IFSC Code</label>
                            <input
                                name="ifsc"
                                value={formData.ifsc}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-2 py-1.5 text-sm rounded border ${isEditing ? 'border-gray-300 bg-white focus:ring-1 focus:ring-indigo-100' : 'border-transparent bg-gray-50 text-gray-700 font-mono uppercase'}`}
                            />
                        </div>
                        <div className="space-y-0.5 md:col-span-2">
                            <label className="text-xs font-medium text-gray-500">Branch</label>
                            <input
                                name="branch"
                                value={formData.branch}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-2 py-1.5 text-sm rounded border ${isEditing ? 'border-gray-300 bg-white focus:ring-1 focus:ring-indigo-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* UPI DETAILS */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50 flex items-center gap-2">
                        <RiQrCodeLine className="text-lg text-teal-600" />
                        <h3 className="text-sm font-bold text-gray-800">UPI</h3>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                            <RiQrCodeLine className="text-4xl text-teal-600 mx-auto mb-1 opacity-50" />
                            <p className="text-[10px] text-teal-800">Instant settlements</p>
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-xs font-medium text-gray-500">UPI ID / VPA</label>
                            <input
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="username@bank"
                                className={`w-full px-2 py-1.5 text-sm rounded border ${isEditing ? 'border-gray-300 bg-white focus:ring-1 focus:ring-teal-100' : 'border-transparent bg-gray-50 text-gray-700'}`}
                            />
                        </div>
                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="w-full py-2 bg-indigo-900 text-white text-sm font-bold rounded-lg shadow hover:bg-indigo-800 transition active:scale-95 mt-auto"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AccountDetails;
