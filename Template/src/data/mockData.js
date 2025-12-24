export const categories = [
    { id: 1, name: "Fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, name: "Electronics", image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=2069&auto=format&fit=crop" },
    { id: 3, name: "Home & Living", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop" },
    { id: 4, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2066&auto=format&fit=crop" },
    { id: 5, name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop" },
    { id: 6, name: "Books", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop" },
];

export const products = Array.from({ length: 40 }).map((_, i) => ({
    id: i + 1,
    name: `Modern Product ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 20,
    category: ["Fashion", "Electronics", "Home & Living", "Beauty", "Sports"][Math.floor(Math.random() * 5)],
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    image: `https://picsum.photos/seed/${i + 1}/500/600`,
    description: "This is a high-quality product designed for modern living. It features durable materials and a sleek design."
}));
