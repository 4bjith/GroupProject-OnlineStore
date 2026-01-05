import React, { useState, useEffect } from "react";
import { FiEdit, FiPackage, FiShoppingBag, FiX, FiCamera, FiPhone, FiMapPin, FiUser } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import authStore from "../../AuthStore";
import api from "../../api/axiosClient";
import { BASE_URL } from "../../api/urls";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function Account() {
  const { addUser, logout } = authStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { slug } = useParams();
  const token = authStore(state => state.token)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    mobile: '',
    address: ''
  });

  // Fetch user details using React Query
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await api.get("/getuserdetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.user;
      } catch (error) {
        if (error.response?.status === 401 || error.response?.data?.message === "Unauthorized") {
          logout();
          toast.error("Your section expires.Please login");
          navigate(`/${slug}/login`);
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize form data when user data is fetched
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        image: userData.profilePic ? (userData.profilePic.startsWith("http") ? userData.profilePic : `${api.defaults.baseURL || "http://localhost:3000"}${userData.profilePic}`) : '',
        mobile: userData.number || '', // Note: Backend uses 'number', frontend used 'mobile'
        address: userData.address || ''
      });
      // Optionally sync back to authStore if needed, but for this task we focus on useQuery
      addUser(userData);
    }
  }, [userData]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (userData?._id) {
        try {
          const res = await api.get(`/order/customer/${userData._id}`);
          if (res.data && res.data.orders) {
            setOrders(res.data.orders);
          }
        } catch (error) {
          console.error("Failed to fetch orders", error);
        }
      }
    };
    if (userData) {
      fetchOrders();
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update local store with new user details
    // Merging existing user data with form updates
    if (userData) {
      addUser({ ...userData, ...formData });
    } else {
      // Handle case where user might be null (e.g. initial setup/guest) by creating a new user object
      addUser({ ...formData, email: 'guest@example.com' });
    }
    setIsModalOpen(false);
  };

  // Default display values if user is not fully set up
  const displayName = userData?.name || "John Doe";
  const displayEmail = userData?.email || "johndoe@email.com";
  const displayImage = userData?.profilePic
    ? (userData.profilePic.startsWith("http") ? userData.profilePic : `${BASE_URL}${userData.profilePic}`)
    : "https://placehold.co/100x100";
  // Backend User model doesn't currently support address, so we check custom field if added or default to empty
  const displayAddress = userData?.address || formData.address;
  const displayMobile = userData?.number; // Backend field is 'number'

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Account
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your profile, orders, and purchase history
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT – PROFILE */}
          <div className="lg:col-span-1 space-y-6">

            {/* PROFILE CARD - Removed outline/border */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={displayImage}
                  alt="User"
                  className="w-20 h-20 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {displayName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {displayEmail}
                  </p>
                  {displayMobile && (
                    <p className="text-sm text-gray-500 mt-1">
                      {displayMobile}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <FiEdit /> Update Profile
              </button>
            </div>

            {/* ADDRESS - Removed outline/border */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-gray-900">
                Address
              </h3>

              <div className="text-sm text-gray-600 leading-relaxed">
                {displayAddress ? (
                  <div className="whitespace-pre-line">{displayAddress}</div>
                ) : (
                  <p className="text-gray-400 italic">No address added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT – ORDERS & HISTORY */}
          <div className="lg:col-span-2 space-y-8">

            {/* ORDERS - Removed outline/border */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiPackage /> Recent Orders
                </h3>
                <button className="text-sm text-blue-600 font-semibold hover:underline">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between bg-gray-50 to-white rounded-xl p-4 hover:shadow-md transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {order.status || 'Pending'}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent orders found.</p>
                )}
              </div>
            </div>

            {/* PURCHASE HISTORY - Removed outline/border */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FiShoppingBag /> Purchase History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-3 pl-2">Product</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition">
                          <td className="py-4 pl-2 font-medium text-gray-900">
                            {order.items.length > 0 ? order.items[0].productId?.name || "Product" : "Order"}
                            {order.items.length > 1 && ` +${order.items.length - 1} more`}
                          </td>
                          <td className="py-4 text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 font-semibold text-gray-900">
                            ₹{order.totalAmount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-gray-500">
                          No purchase history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Image Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Profile Image</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCamera className="text-gray-400 group-focus-within:text-blue-500 transition" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-0 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {formData.image && (
                  <div className="flex justify-center mt-2">
                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-sm border" />
                  </div>
                )}
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 group-focus-within:text-blue-500 transition" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-0 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400 group-focus-within:text-blue-500 transition" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-0 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                    placeholder="+91 ..."
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <div className="relative group">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiMapPin className="text-gray-400 group-focus-within:text-blue-500 transition" />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border-0 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all resize-none"
                    placeholder="Your full address..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
