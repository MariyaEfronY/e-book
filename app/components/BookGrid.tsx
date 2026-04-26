"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    ShoppingBag,
    Loader2,
    Eye,
    Search,
    Filter,
    ChevronDown,
    BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookGrid() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("new");

    // 🔥 NEW: track loading per book
    const [payingBookId, setPayingBookId] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("/api/public-users");
                const data = await res.json();
                if (data.success) setBooks(
                    data.books.map((b: any) => ({
                        ...b,
                        _id: b._id || b.id, // ✅ ensures consistency
                    }))
                );
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleBuyClick = (book: any) => {
        const isLoggedIn = document.cookie.includes("token"); // simple check

        if (!isLoggedIn) {
            const redirectUrl = `/buy?bookId=${book._id}`;

            router.push(
                `/login?callbackUrl=${encodeURIComponent(redirectUrl)}`
            );
            return;
        }

        handlePayment(book); // already exists
    };

    // 💳 Razorpay Payment Handler
    const handlePayment = async (book: any) => {
        try {
            setPayingBookId(book._id);

            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookId: book._id || book.id,
                    // 🔥 replace with real auth user
                }),
            });

            const order = await res.json();

            if (!order.id) {
                alert(order.message || "Order creation failed");
                setPayingBookId(null);
                return;
            }
            if (!book?._id && !book?.id) {
                console.error("❌ Invalid book object:", book);
                alert("Invalid book data");
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: order.amount,
                currency: "INR",
                name: book.title,
                description: "Book Purchase",
                order_id: order.id,

                handler: async (response: any) => {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(response),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        alert("Payment successful 🎉");
                        router.push(`/library/${book._id}`);
                    } else {
                        alert("Verification failed");
                    }

                    setPayingBookId(null);
                },

                modal: {
                    ondismiss: () => {
                        setPayingBookId(null);
                    },
                },

                theme: {
                    color: "#d902ee",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed");
            setPayingBookId(null);
        }
    };

    const filteredBooks = books
        .filter((book) => {
            const searchMatch =
                book.title?.toLowerCase().includes(search.toLowerCase()) ||
                book.author?.toLowerCase().includes(search.toLowerCase());
            const filterMatch =
                filter === "all" ||
                (filter === "free" ? book.isFree : !book.isFree);
            return searchMatch && filterMatch;
        })
        .sort((a, b) => {
            if (sort === "price-low") return a.price - b.price;
            if (sort === "price-high") return b.price - a.price;
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="animate-spin text-[#d902ee]" size={48} />
                <p className="text-[#ffd79d] font-mono tracking-widest animate-pulse">
                    SYNCHING NEXUS...
                </p>
            </div>
        );

    return (
        <section className="w-full px-4 py-12 mx-auto text-white max-w-7xl">
            {/* GRID */}
            <motion.div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filteredBooks.map((book) => (
                        <motion.div
                            key={book._id}
                            layout
                            className="group relative bg-[#1a0521] rounded-[2.5rem] p-5 border border-[#d902ee22]"
                        >
                            {/* COVER */}
                            <div className="relative aspect-[3/4] rounded-[1.8rem] overflow-hidden mb-6">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="object-cover w-full h-full"
                                />

                                <div className="absolute top-4 right-4 bg-black/60 px-4 py-1.5 rounded-full">
                                    <span className="text-[#ffd79d] font-black text-xs">
                                        {book.isFree ? "OPEN" : `₹${book.price}`}
                                    </span>
                                </div>
                            </div>

                            {/* TITLE */}
                            <h3 className="mb-2 text-xl font-black">
                                {book.title}
                            </h3>

                            {/* ACTIONS */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => router.push(`/preview/${book._id}`)}
                                    className="py-3 rounded-xl bg-white/10"
                                >
                                    <Eye size={14} /> Preview
                                </button>

                                <button
                                    disabled={payingBookId === book._id}
                                    onClick={() => {
                                        if (book.isFree) {
                                            router.push(book.fullPdfUrl);
                                            return;
                                        }

                                        // 🔐 check login (cookie-based)
                                        const isLoggedIn = document.cookie.includes("token");

                                        if (!isLoggedIn) {
                                            const redirectUrl = `/buy?bookId=${book._id}`;

                                            router.push(
                                                `/login?callbackUrl=${encodeURIComponent(redirectUrl)}`
                                            );
                                            return;
                                        }

                                        // 💳 already logged in → proceed payment
                                        handlePayment(book);
                                    }}
                                    className={`py-3 rounded-xl flex items-center justify-center gap-2 ${book.isFree
                                        ? "bg-white text-black"
                                        : "bg-[#d902ee] text-white"
                                        }`}
                                >
                                    {payingBookId === book._id ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : book.isFree ? (
                                        <Download size={14} />
                                    ) : (
                                        <ShoppingBag size={14} />
                                    )}

                                    {book.isFree ? "GET" : "BUY"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}