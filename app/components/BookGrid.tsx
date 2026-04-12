"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ShoppingBag, Loader2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function BookGrid() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔥 NEW STATES
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

    // 🔥 FILTER + SEARCH + SORT
    const filteredBooks = books
        .filter((book) => {
            const searchMatch =
                book.title?.toLowerCase().includes(search.toLowerCase()) ||
                book.author?.toLowerCase().includes(search.toLowerCase()) ||
                (book.isbn || "").toLowerCase().includes(search.toLowerCase());

            const filterMatch =
                filter === "all" ||
                (filter === "free" && book.isFree) ||
                (filter === "paid" && !book.isFree);

            return searchMatch && filterMatch;
        })
        .sort((a, b) => {
            if (sort === "price-low") return a.price - b.price;
            if (sort === "price-high") return b.price - a.price;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    // 🔐 Purchase / Download Logic
    const handleAction = (book: any) => {
        const isLoggedIn = document.cookie.includes("token");

        if (!isLoggedIn) {
            const destination = `/checkout/${book.id}`;
            router.push(`/login?callbackUrl=${encodeURIComponent(destination)}`);
            return;
        }

        if (book.isFree) {
            window.open(book.fullPdfUrl, "_blank");
        } else {
            router.push(`/checkout/${book.id}`);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
                <Loader2 className="animate-spin" color={COLORS.primary} size={40} />
            </div>
        );
    }

    return (
        <section style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>

            {/* 🔍 SEARCH + FILTER UI */}
            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "30px",
                    flexWrap: "wrap",
                }}
            >
                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search by title, author, ISBN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: "1",
                        padding: "12px 15px",
                        borderRadius: "12px",
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.glass,
                        color: "white",
                        outline: "none",
                        minWidth: "250px",
                    }}
                />

                {/* FILTER */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        padding: "12px",
                        borderRadius: "12px",
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.glass,
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    <option value="all">All</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                </select>

                {/* SORT */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                        padding: "12px",
                        borderRadius: "12px",
                        border: `1px solid ${COLORS.border}`,
                        background: COLORS.glass,
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    <option value="new">Newest</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                </select>
            </div>

            {/* 📚 BOOK GRID */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "30px",
                }}
            >
                {filteredBooks.length === 0 ? (
                    <p style={{ color: "white" }}>No books found.</p>
                ) : (
                    filteredBooks.map((book: any, i) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -10 }}
                            style={{
                                background: COLORS.glass,
                                borderRadius: "24px",
                                border: `1px solid ${COLORS.border}`,
                                padding: "20px",
                                backdropFilter: "blur(10px)",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* COVER */}
                            <div
                                style={{
                                    height: "350px",
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    marginBottom: "20px",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src={book.coverImage || "https://via.placeholder.com/300x450"}
                                    alt={book.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />

                                <div
                                    style={{
                                        position: "absolute",
                                        top: "12px",
                                        right: "12px",
                                        background: "rgba(0,0,0,0.8)",
                                        padding: "6px 12px",
                                        borderRadius: "10px",
                                        color: COLORS.accent,
                                        fontWeight: "800",
                                        fontSize: "12px",
                                    }}
                                >
                                    {book.isFree ? "FREE" : `₹${book.price}`}
                                </div>
                            </div>

                            {/* TITLE */}
                            <h3 style={{ margin: "0 0 5px", fontSize: "20px", color: "white" }}>
                                {book.title}
                            </h3>

                            {/* AUTHOR */}
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                                by <span style={{ color: COLORS.primary }}>{book.author}</span>
                            </p>

                            {/* ISBN */}
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                                ISBN: <span style={{ color: COLORS.accent }}>{book.isbn || "N/A"}</span>
                            </p>

                            {/* BUTTONS */}
                            <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                                {book.previewUrl && (
                                    <button
                                        onClick={() => router.push(`/preview/${book.id}`)}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            borderRadius: "12px",
                                            border: `1px solid ${COLORS.primary}`,
                                            color: COLORS.primary,
                                            background: "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Eye size={16} /> Preview
                                    </button>
                                )}

                                <button
                                    onClick={() => handleAction(book)}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        borderRadius: "12px",
                                        background: book.isFree ? "white" : COLORS.primary,
                                        color: book.isFree ? "black" : "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    {book.isFree ? <Download size={16} /> : <ShoppingBag size={16} />}
                                    {book.isFree ? "Download" : "Buy"}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}