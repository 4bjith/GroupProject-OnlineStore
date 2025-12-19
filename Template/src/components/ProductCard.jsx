import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../Frontend-main/src/api/urls';

const ProductCard = ({ product }) => {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e) => {
        e.preventDefault(); // prevent navigation if wrapped in Link
        e.stopPropagation();
        addItem(product);
        toast.success(`${product.name} added to cart!`);
    };
    console.log(product);

    return (
        <Link to={`/products/${product._id}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
                    {product.images ? (
                        <img
                            src={product?.images[0]?.startsWith('http'||'data') ? product?.images[0]: `${BASE_URL}/${product.images[0]}`}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                    )}

                    {/* Overlay Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-4 right-4 bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                    >
                        <FiShoppingCart size={20} />
                    </button>

                    {/* Badge Example */}
                    {/* <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">NEW</span> */}
                </div>

                {/* Details */}
                <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{product.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-slate-900 text-lg">${product.price.toFixed(2)}</span>
                        {/* Rating could go here */}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
