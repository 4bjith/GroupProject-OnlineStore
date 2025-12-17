import { Link } from 'react-router-dom';
import { categories, products } from '../data/mockData';
import ProductCard from '../components/ProductCard';

const Home = () => {
    // Get top 8 products
    const topProducts = products.slice(0, 8);

    return (
        <div className="space-y-16 pb-16">
            {/* HERO SECTION */}
            <section className="relative h-[600px] flex items-center bg-gray-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Elevate Your Lifestyle
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Discover the latest trends in fashion, electronics, and home living. Quality products curated just for you.
                    </p>
                    <Link to="/products">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl">
                            Shop Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* CATEGORIES SECTION (Scrollable) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop by Category</h2>
                    <Link to="/products" className="text-blue-600 font-semibold hover:underline">View All</Link>
                </div>

                {/* Scroll Container */}
                <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x">
                    {categories.map((cat) => (
                        <Link
                            to={`/products?category=${cat.name}`}
                            key={cat.id}
                            className="flex-shrink-0 w-64 snap-start group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* TOP PRODUCTS SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">Top Trending Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link to="/products">
                        <button className="border border-slate-900 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all duration-300">
                            View All Products
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
