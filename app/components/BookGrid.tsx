"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download, ShoppingBag, Loader2, Eye,
    Search, Filter, ChevronDown, BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookGrid() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("new");
    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("/api/public-users");
                const data = await res.json();
                if (data.success) setBooks(data.books);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const filteredBooks = books
        .filter((book) => {
            const searchMatch =
                book.title?.toLowerCase().includes(search.toLowerCase()) ||
                book.author?.toLowerCase().includes(search.toLowerCase());
            const filterMatch = filter === "all" || (filter === "free" ? book.isFree : !book.isFree);
            return searchMatch && filterMatch;
        })
        .sort((a, b) => {
            if (sort === "price-low") return a.price - b.price;
            if (sort === "price-high") return b.price - a.price;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="animate-spin text-[#d902ee]" size={48} />
            <p className="text-[#ffd79d] font-mono tracking-widest animate-pulse">SYNCHING NEXUS...</p>
        </div>
    );

    return (
        <section className="w-full px-4 py-12 mx-auto text-white max-w-7xl">

            {/* 🔍 SEARCH & FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 items-center bg-[#ffffff05] p-4 rounded-[2rem] border border-[#d902ee22] backdrop-blur-md">
                <div className="relative flex-1 w-full">
                    <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-white/30" size={18} />
                    <input
                        type="text"
                        placeholder="Search publications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#d902ee] outline-none transition-all placeholder:text-white/20"
                    />
                </div>

                <div className="flex w-full gap-3 md:w-auto">
                    <div className="relative flex-1 md:w-40">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d902ee]" size={14} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl appearance-none outline-none cursor-pointer focus:border-[#d902ee]"
                        >
                            <option value="all">All Content</option>
                            <option value="free">Free Access</option>
                            <option value="paid">Premium</option>
                        </select>
                        <ChevronDown className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-white/30" size={14} />
                    </div>

                    <div className="relative flex-1 md:w-48">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl appearance-none outline-none cursor-pointer focus:border-[#d902ee]"
                        >
                            <option value="new">Latest Release</option>
                            <option value="price-low">Lowest Price</option>
                            <option value="price-high">Highest Price</option>
                        </select>
                        <ChevronDown className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-white/30" size={14} />
                    </div>
                </div>
            </div>

            {/* 📚 DYNAMIC GRID */}
            <motion.div
                layout
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredBooks.map((book) => (
                        <motion.div
                            key={book.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-[#1a0521] rounded-[2.5rem] p-5 border border-[#d902ee22] hover:border-[#d902ee88] transition-colors overflow-hidden flex flex-col"
                        >
                            {/* COVER ART */}
                            <div className="relative aspect-[3/4] rounded-[1.8rem] overflow-hidden mb-6 shadow-2xl">
                                <img
                                    src={book.coverImage || "https://via.placeholder.com/400x600"}
                                    alt={book.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-end p-6 transition-opacity opacity-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:opacity-100">
                                    <p className="text-[10px] text-[#ffd79d] font-black tracking-widest uppercase">Buy for Access</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full shadow-xl">
                                    <span className="text-[#ffd79d] font-black text-xs">
                                        {book.isFree ? "OPEN" : `₹${book.price}`}
                                    </span>
                                </div>
                            </div>

                            {/* DETAILS */}
                            <div className="flex-1">
                                <h3 className="text-xl font-black mb-1 line-clamp-1 group-hover:text-[#d902ee] transition-colors uppercase tracking-tighter">
                                    {book.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d902ee]" />
                                    <p className="text-xs font-bold tracking-widest uppercase text-white/40">{book.author}</p>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
                                <button
                                    onClick={() => router.push(`/preview/${book.id}`)}
                                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-black transition-all"
                                >
                                    <Eye size={14} className="text-[#d902ee]" /> PREVIEW
                                </button>

                                <button
                                    onClick={() => router.push(book.isFree ? book.fullPdfUrl : `/checkout/${book.id}`)}
                                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black transition-all shadow-lg ${book.isFree
                                        ? "bg-white text-black hover:bg-[#ffd79d]"
                                        : "bg-[#d902ee] text-white shadow-[#d902ee33] hover:scale-105"
                                        }`}
                                >
                                    {book.isFree ? <Download size={14} /> : <ShoppingBag size={14} />}
                                    {book.isFree ? "GET" : "PURCHASE"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredBooks.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <BookOpen className="mx-auto mb-4 text-white/10" size={48} />
                    <p className="font-bold tracking-widest uppercase text-white/40">No matching publications found</p>
                </div>
            )}
        </section>
    );
}