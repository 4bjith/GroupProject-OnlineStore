import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { products as mockProducts } from "../data/mockData";
import useCartStore from "../../Zustand/cartStore";
import useShopStore from "../../Zustand/shopStore";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import { BASE_URL } from "../../api/urls";

const ProductView = () => {
  const store = useShopStore((state) => state.store);
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const storeSlug = store?.slug ? `/${store.slug}` : "";

  // Fetch Product by ID
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/products/${id}`);
        return response.data;
      } catch (err) {
        return null;
      }
    },
  });

  // const mockProduct = mockProducts.find(p => p.id === parseInt(id));
  const product = productData;

  if (isLoading)
    return <div className="p-20 text-center">Loading product...</div>;
  if (!product)
    return <div className="p-20 text-center">Product not found.</div>;

  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    toast.success(`Added ${quantity} ${product.title || product.name} to cart`);
  };

  // let imageUrl = product?.images[0] ?
  //     (product.images[0].startsWith('http') ? product.images[0] : `${BASE_URL}/${product.images[0]}`)
  //     : "https://placehold.co/600x600";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to={`${storeSlug}/store-products`}
        className="text-gray-500 mb-6 hover:text-black inline-block"
      >
        Back to products
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
          <img
            src={
              product?.images[0]
                ? product.images[0].startsWith("http")
                  ? product.images[0]
                  : `${BASE_URL}${product.images[0]}`
                : "https://placehold.co/600x600"
            }
            alt={product.title || product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {product.category}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900">
            {product.title || product.name}
          </h1>
          <p className="text-3xl font-bold text-slate-900">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                In Stock: {product.stock || "Unknown"}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                <FiShoppingCart /> Add to Cart
              </button>
              {/* Wishlist Button could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
