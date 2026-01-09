import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderComplete = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="text-green-500 text-6xl mb-6">
                <FiCheckCircle />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-500 mb-8 max-w-md">
                Your order has been placed successfully. You will receive an email confirmation shortly.
            </p>
            <div className="space-x-4">
                <Link to="/">
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                        Back Home
                    </button>
                </Link>
                <Link to="/products">
                    <button className="bg-white border border-gray-300 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default OrderComplete;
