import { Link, useOutletContext } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import useCartStore from "../Zustand/cartStore";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/urls";

const ProductCard = ({ product }) => {
  const context = useOutletContext();
  const storeSlug = context?.store?.slug ? `/${context.store.slug}` : '';
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.title} added to cart!`);
  };

  const imageSrc = product.images?.[0]
    ? product.images[0].startsWith("http") ||
      product.images[0].startsWith("data")
      ? product.images[0]
      : `${BASE_URL}${product.images[0]}`
    : null;

  return (
    <Link to={`${storeSlug}/product/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">

        {/* IMAGE */}
        <div className="relative aspect-4/5 bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white text-slate-900 p-3 rounded-full shadow-lg
                       opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-300 hover:bg-slate-900 hover:text-white"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>

        {/* DETAILS */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="font-semibold text-slate-800 text-lg truncate">
            {product.title}
          </h3>
          <div className="mt-2 font-bold text-slate-900 text-lg">
            ₹{product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
