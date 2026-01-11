import React, { useState } from 'react';
import { BiCheck } from 'react-icons/bi';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'la', name: 'Latin', nativeName: 'Lingua Latina' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

const Language = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Language Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Select your preferred language for the interface.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`
              relative group flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200
              ${selectedLanguage === lang.code
                                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                            }
            `}
                    >
                        <span className={`text-sm font-semibold mb-0.5 ${selectedLanguage === lang.code ? 'text-indigo-900' : 'text-gray-700'}`}>
                            {lang.name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                            {lang.nativeName}
                        </span>

                        {/* Checkmark for selected state */}
                        {selectedLanguage === lang.code && (
                            <div className="absolute top-2 right-2 text-indigo-600 bg-indigo-100 rounded-full p-0.5">
                                <BiCheck className="text-sm" />
                            </div>
                        )}

                        {/* Subtle hover effect light */}
                        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none 
              ${selectedLanguage === lang.code ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'} 
              bg-gradient-to-tr from-transparent to-indigo-50/30`}
                        />
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                <button className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-200">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Language;
