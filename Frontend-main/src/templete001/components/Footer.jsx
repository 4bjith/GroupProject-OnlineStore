import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = ({ store }) => {
    const storeName = store?.name || 'StoreTemplate';
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{storeName}</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Your one-stop shop for modern lifestyle products. Quality meets affordability in every purchase.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <FaFacebook className="text-xl hover:text-white cursor-pointer transition-colors" />
                            <FaTwitter className="text-xl hover:text-white cursor-pointer transition-colors" />
                            <FaInstagram className="text-xl hover:text-white cursor-pointer transition-colors" />
                            <FaYoutube className="text-xl hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Discounted</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Stay in loop</h3>
                        <p className="text-sm text-slate-400 mb-4">Get the latest updates and offers.</p>
                        <div className="flex">
                            <input type="email" placeholder="Your email" className="bg-slate-800 text-white px-4 py-2 rounded-l-lg outline-none focus:ring-1 focus:ring-blue-500 w-full" />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg font-bold hover:bg-blue-500 transition-colors">Join</button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} StoreTemplate. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
