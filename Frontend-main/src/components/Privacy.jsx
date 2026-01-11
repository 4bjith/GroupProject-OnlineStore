import React, { useState } from 'react';
import { BiShield, BiLock, BiCookie, BiData, BiServer, BiUserCheck, BiCheckDouble, BiChevronDown, BiChevronUp } from 'react-icons/bi';

const Privacy = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (index) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const lastUpdated = "January 7, 2026";

    const sections = [
        {
            title: "1. Information We Collect",
            icon: <BiData className="text-xl" />,
            content: (
                <div className="space-y-3 text-gray-600">
                    <p>To provide you with our shop creation services, we collect standard information including:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Account Information:</strong> Name, email address, password, and contact details provided during registration.</li>
                        <li><strong>Store Data:</strong> Product listings, categories, pricing, images, and descriptions you upload for your online shop.</li>
                        <li><strong>Usage Data:</strong> Information on how you interact with our platform, features used, and time spent.</li>
                        <li><strong>Transaction Details:</strong> We do not store full credit card numbers. Payment processing is handled by secure third-party providers (e.g., Stripe, PayPal).</li>
                    </ul>
                </div>
            )
        },
        {
            title: "2. How We Use Your Information",
            icon: <BiServer className="text-xl" />,
            content: (
                <div className="space-y-3 text-gray-600">
                    <p>Your data powers your experience. We use it to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Host Your Shop:</strong> Display your products and categories to potential customers visiting your online store.</li>
                        <li><strong>Process Transactions:</strong> Facilitate orders and payments between you and your customers securely.</li>
                        <li><strong>Platform Improvement:</strong> Analyze usage patterns to enhance features, speed, and reliability.</li>
                        <li><strong>Communication:</strong> Send critical updates about your account, security alerts, or new feature announcements.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "3. Data Sharing & Visibility",
            icon: <BiUserCheck className="text-xl" />,
            content: (
                <div className="space-y-3 text-gray-600">
                    <p>Transparency is key to our platform model:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Public Visibility:</strong> Your shop name, products, and categories are public-facing so customers can find and purchase from you.</li>
                        <li><strong>No Sale of Data:</strong> We do not sell your personal data to advertisers or third parties.</li>
                        <li><strong>Service Providers:</strong> We may share data with trusted infrastructure partners (e.g., hosting services, email delivery) strictly to operate the service.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "4. Security Measures",
            icon: <BiLock className="text-xl" />,
            content: (
                <div className="space-y-3 text-gray-600">
                    <p>We implement robust industry-standard security practices:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Encryption:</strong> Data is encrypted in transit (using TLS/SSL) and at rest where applicable.</li>
                        <li><strong>Access Controls:</strong> Strict internal access controls ensure only authorized personnel can access critical systems.</li>
                        <li><strong>Regular Audits:</strong> We periodically review our security architecture to identify and mitigate risks.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "5. Cookies & Tracking",
            icon: <BiCookie className="text-xl" />,
            content: (
                <div className="space-y-3 text-gray-600">
                    <p>We use cookies to improve your session experience:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Essential Cookies:</strong> Required for logging in and keeping your session active.</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings (e.g., language, dashboard layout).</li>
                        <li><strong>Analytics:</strong> We use anonymized data to understand platform traffic and performance.</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">

            {/* Header Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 p-24 bg-indigo-500 opacity-10 rounded-full transform -translate-x-8 translate-y-8"></div>

                <div className="relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-100 text-xs font-medium mb-4">
                        <BiShield className="text-lg" /> Official Policy
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Privacy Policy</h1>
                    <p className="text-indigo-100 max-w-2xl text-lg opacity-90 leading-relaxed">
                        We are committed to protecting your data while you build your business.
                        This policy outlines how your information is handled on our e-commerce platform.
                    </p>
                    <p className="mt-6 text-xs text-indigo-300 font-mono">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <BiCheckDouble className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Transparent</h3>
                        <p className="text-xs text-gray-500 mt-1">Clear usage of your store data</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <BiLock className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Secure</h3>
                        <p className="text-xs text-gray-500 mt-1">Industry-standard encryption</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <BiData className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Ownership</h3>
                        <p className="text-xs text-gray-500 mt-1">Your shop data belongs to you</p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${expandedSection === index
                                ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50'
                                : 'border-gray-100 shadow-sm hover:border-gray-200'
                            }`}
                    >
                        <button
                            onClick={() => toggleSection(index)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg transition-colors ${expandedSection === index ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-500'
                                    }`}>
                                    {section.icon}
                                </div>
                                <h2 className={`font-bold text-lg ${expandedSection === index ? 'text-indigo-900' : 'text-gray-700'
                                    }`}>{section.title}</h2>
                            </div>
                            <div className={`transition-transform duration-300 ${expandedSection === index ? 'rotate-180' : ''}`}>
                                <BiChevronDown className="text-2xl text-gray-400" />
                            </div>
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${expandedSection === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div className="p-5 pt-0 pl-[4.5rem] pr-8 pb-8">
                                {section.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Contact */}
            <div className="mt-10 text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <p className="text-gray-500 text-sm">
                    Have questions about your data? Contact our Data Protection Officer at <br />
                    <a href="mailto:privacy@platform.com" className="text-indigo-600 font-semibold hover:underline mt-1 inline-block">privacy@platform.com</a>
                </p>
            </div>
        </div>
    );
};

export default Privacy;
