import React, { useState } from 'react';
import { BiSupport, BiMessageDetail, BiSend, BiCheckCircle, BiQuestionMark, BiFile } from 'react-icons/bi';
import { BsLifePreserver } from 'react-icons/bs';
import authStore from '../AuthStore';
import toast from 'react-hot-toast';

const Support = () => {
    // Get user email from store if available
    const user = authStore((state) => state.user);
    const userEmail = user?.email || "";

    const [formData, setFormData] = useState({
        subject: '',
        category: 'feedback', // feedback, report, other
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            toast.success("Message sent successfully!");

            // Allow sending another after a delay or user action
        }, 1500);
    };

    const resetForm = () => {
        setFormData({ subject: '', category: 'feedback', message: '' });
        setIsSent(false);
    };

    if (isSent) {
        return (
            <div className="max-w-xl mx-auto min-h-[500px] flex flex-col items-center justify-center text-center animate-fadeIn p-6">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <BiCheckCircle className="text-5xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Received!</h2>
                <p className="text-gray-500 max-w-sm mb-8">
                    Thank you for contacting us. We have sent a confirmation to
                    <span className="font-semibold text-gray-700 block mt-1">{userEmail}</span>
                </p>
                <button
                    onClick={resetForm}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-fadeIn">

            {/* Header / Hero */}
            <div className="bg-indigo-600 rounded-2xl p-8 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
                    <p className="text-indigo-100 max-w-md opacity-90">
                        Have a question, feedback, or found a bug? We're here to help you build the perfect online store.
                    </p>
                </div>
                <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hidden md:block">
                    <BsLifePreserver className="text-5xl text-indigo-100" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 bg-gray-50 flex items-center gap-3">
                            <BiMessageDetail className="text-xl text-indigo-600" />
                            <h2 className="font-bold text-gray-800">Send us a Message</h2>
                        </div>

                        <div className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Topic</label>
                                        <div className="relative">
                                            <select
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="feedback">Feature Request / Feedback</option>
                                                <option value="report">Report a Bug / Issue</option>
                                                <option value="account">Account & Billing</option>
                                                <option value="other">Other Inquiry</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Briefly describe the issue..."
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Your Message</label>
                                    <textarea
                                        required
                                        rows="6"
                                        placeholder="Tell us more details. If reporting a bug, please include steps to reproduce..."
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <p className="text-xs text-gray-400">
                                        Sending as: <span className="font-medium text-gray-600">{userEmail || 'Anonymous'}</span>
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all transform active:scale-95 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                <BiSend /> Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Col: FAQs or Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <BiQuestionMark className="bg-orange-100 text-orange-500 rounded p-1 text-2xl" />
                            Quick FAQs
                        </h3>
                        <div className="space-y-4">
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                    <h2 className="font-medium text-sm">How do I verify my bank account?</h2>
                                    <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                    Go to Settings &gt; Payments and add your bank details. Our team will verify them within 24-48 hours.
                                </p>
                            </details>

                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                    <h2 className="font-medium text-sm">Can I change my shop URL?</h2>
                                    <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                    Currently, store URLs are fixed upon creation. Please contact support if you need a critical change.
                                </p>
                            </details>

                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                    <h2 className="font-medium text-sm">Where are my payouts?</h2>
                                    <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                    Payouts are processed weekly. different banks may have varying processing times. Check 'Transactions' for status.
                                </p>
                            </details>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-indigo-100 p-6">
                        <h3 className="font-bold text-indigo-900 mb-2">Documentation</h3>
                        <p className="text-xs text-indigo-700 mb-4 leading-relaxed">
                            Check our detailed guides for setting up products, managing inventory, and customizing your store.
                        </p>
                        <button className="w-full py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                            <BiFile /> View Docs
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Support;
