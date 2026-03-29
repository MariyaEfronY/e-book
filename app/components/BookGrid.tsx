"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 13/14/15/16

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function BookGrid() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // ✅ Moved inside the component

    useEffect(() => {
        const fetchLiveBooks = async () => {
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
        fetchLiveBooks();
    }, []);

    // 🔐 Purchase / Download Protection Logic
    const handleAction = (book: any) => {
        // Check for "token" since that's what your backend sets
        const isLoggedIn = document.cookie.includes("token");

        if (!isLoggedIn) {
            // ✅ Correct: The URL should NOT include "(auth)"
            const destination = `/checkout/${book._id}`;
            router.push(`/login?callbackUrl=${encodeURIComponent(destination)}`);
            return;
        }

        if (book.isFree) {
            window.open(book.fileUrl, "_blank");
        } else {
            router.push(`/checkout/${book._id}`);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
            <Loader2 className="animate-spin" color={COLORS.primary} size={40} />
        </div>
    );

    return (
        <section style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "30px"
            }}>
                {books.map((book: any, i) => (
                    <motion.div
                        key={book._id}
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
                            flexDirection: "column"
                        }}
                    >
                        <div style={{ height: "350px", borderRadius: "15px", overflow: "hidden", marginBottom: "20px", position: "relative" }}>
                            <img
                                src={book.coverImage || "https://via.placeholder.com/300x450"}
                                alt={book.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.8)",
                                padding: "6px 12px", borderRadius: "10px", color: COLORS.accent, fontWeight: "800", fontSize: "12px"
                            }}>
                                {book.isFree ? "FREE" : `₹${book.price}`}
                            </div>
                        </div>

                        <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "800", color: "white" }}>
                            {book.title}
                        </h3>
                        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                            by <span style={{ color: COLORS.primary, fontWeight: "700" }}>{book.authorId?.name || "Efron Author"}</span>
                        </p>

                        <button
                            onClick={() => handleAction(book)} // ✅ Trigger the protected action
                            style={{
                                marginTop: "auto", width: "100%", padding: "14px", borderRadius: "14px",
                                background: book.isFree ? "white" : COLORS.primary,
                                color: book.isFree ? "black" : "white",
                                border: "none", fontWeight: "900", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                transition: "transform 0.2s active"
                            }}
                        >
                            {book.isFree ? <Download size={18} /> : <ShoppingBag size={18} />}
                            {book.isFree ? "DOWNLOAD" : "BUY ACCESS"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}