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
    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("/api/public-users"); // ✅ UPDATED API
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

    // 🔐 Purchase / Download Logic
    const handleAction = (book: any) => {
        const isLoggedIn = document.cookie.includes("token");

        if (!isLoggedIn) {
            const destination = `/checkout/${book.id}`;
            router.push(`/login?callbackUrl=${encodeURIComponent(destination)}`);
            return;
        }

        if (book.isFree) {
            window.open(book.fullPdfUrl, "_blank"); // ✅ UPDATED

            // window.open(`/api/books/${book.id}/watermarked`)
        } else {
            router.push(`/checkout/${book.id}`);
        }
    };

    if (loading)
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
                <Loader2 className="animate-spin" color={COLORS.primary} size={40} />
            </div>
        );

    return (
        <section style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "30px",
                }}
            >
                {books.map((book: any, i) => (
                    <motion.div
                        key={book.id} // ✅ FIXED
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

                            {/* PRICE BADGE */}
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
                        <h3
                            style={{
                                margin: "0 0 5px 0",
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "white",
                            }}
                        >
                            {book.title}
                        </h3>

                        {/* AUTHOR */}
                        <p
                            style={{
                                margin: "0 0 8px 0",
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.4)",
                            }}
                        >
                            by{" "}
                            <span style={{ color: COLORS.primary, fontWeight: "700" }}>
                                {book.author || "Unknown"}
                            </span>
                        </p>

                        {/* ISBN */}
                        <p
                            style={{
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.3)",
                                marginBottom: "15px",
                            }}
                        >
                            ISBN:{" "}
                            <span style={{ color: COLORS.accent }}>
                                {book.isbn || "N/A"}
                            </span>
                        </p>

                        {/* BUTTONS */}
                        <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>

                            {/* PREVIEW */}
                            {book.previewUrl && (
                                <button
                                    onClick={() => router.push(`/preview/${book.id}`)} style={{
                                        flex: 1,
                                        padding: "12px",
                                        borderRadius: "12px",
                                        background: "transparent",
                                        border: `1px solid ${COLORS.primary}`,
                                        color: COLORS.primary,
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Eye size={16} />
                                    Preview
                                </button>
                            )}

                            {/* MAIN ACTION */}
                            <button
                                onClick={() => handleAction(book)}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: "12px",
                                    background: book.isFree ? "white" : COLORS.primary,
                                    color: book.isFree ? "black" : "white",
                                    border: "none",
                                    fontWeight: "900",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                }}
                            >
                                {book.isFree ? <Download size={16} /> : <ShoppingBag size={16} />}
                                {book.isFree ? "Download" : "Buy"}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}