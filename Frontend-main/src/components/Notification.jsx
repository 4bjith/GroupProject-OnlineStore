import React, { useState } from 'react';
import { BiBell, BiEnvelope, BiShoppingBag, BiShield, BiInfoCircle } from 'react-icons/bi';

const Notification = () => {
    // Mock state for UI demonstration
    const [settings, setSettings] = useState({
        // Order Updates
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,

        // Account Activity
        loginAlert: true,
        passwordChange: true,

        // Promotions
        newsletter: false,
        specialOffers: true,

        // System
        maintenance: true,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const Toggle = ({ active, onClick }) => (
        <button
            onClick={onClick}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${active ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    const Section = ({ title, icon: Icon, children }) => (
        <div className="mb-8 last:mb-0">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4 pl-0 md:pl-12">
                {children}
            </div>
        </div>
    );

    const Item = ({ label, description, stateKey }) => (
        <div className="flex items-start justify-between group">
            <div className="pr-4">
                <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-900 transition-colors">
                    {label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="flex-shrink-0 pt-0.5">
                <Toggle
                    active={settings[stateKey]}
                    onClick={() => handleToggle(stateKey)}
                />
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in duration-500 max-w-3xl">
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Notification Preferences
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage how and when you want to be notified.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column */}
                <div className="space-y-1">
                    <Section title="Orders & Purchases" icon={BiShoppingBag}>
                        <Item
                            label="Order Confirmation"
                            description="Receive an email when you place an order."
                            stateKey="orderConfirmation"
                        />
                        <Item
                            label="Shipping Updates"
                            description="Get notified when your order is shipped."
                            stateKey="orderShipped"
                        />
                        <Item
                            label="Delivery Status"
                            description="Be alerted when your package arrives."
                            stateKey="orderDelivered"
                        />
                    </Section>

                    <div className="md:hidden h-px bg-gray-100 my-4" /> {/* Mobile divider */}

                    <Section title="Promotions & News" icon={BiEnvelope}>
                        <Item
                            label="Weekly Newsletter"
                            description="Get the latest trends and updates."
                            stateKey="newsletter"
                        />
                        <Item
                            label="Special Offers"
                            description="Exclusive discounts and personalized deals."
                            stateKey="specialOffers"
                        />
                    </Section>
                </div>

                {/* Right Column */}
                <div className="space-y-1">
                    <Section title="Account Security" icon={BiShield}>
                        <Item
                            label="New Login Alerts"
                            description="Notifies you of logins from new devices."
                            stateKey="loginAlert"
                        />
                        <Item
                            label="Password Changes"
                            description="Alert when your password is updated."
                            stateKey="passwordChange"
                        />
                    </Section>

                    <div className="md:hidden h-px bg-gray-100 my-4" /> {/* Mobile divider */}

                    <Section title="System" icon={BiInfoCircle}>
                        <Item
                            label="Maintenance Updates"
                            description="Planned downtime and system improvements."
                            stateKey="maintenance"
                        />
                    </Section>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                    Reset to Default
                </button>
                <button className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-200">
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default Notification;
