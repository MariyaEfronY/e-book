"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ShoppingBag, Loader2, BookOpen } from "lucide-react";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function BookGrid() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveBooks = async () => {
            try {
                // Ensure this API endpoint matches your route.ts location
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

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
            <Loader2 className="animate-spin" color={COLORS.primary} size={40} />
        </div>
    );

    return (
        <section style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
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
                            <img src={book.coverImage} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div style={{
                                position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.8)",
                                padding: "6px 12px", borderRadius: "10px", color: COLORS.accent, fontWeight: "800", fontSize: "12px"
                            }}>
                                {book.isFree ? "FREE" : `₹${book.price}`}
                            </div>
                        </div>

                        <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "800", color: "white" }}>{book.title}</h3>
                        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                            by <span style={{ color: COLORS.primary, fontWeight: "700" }}>{book.authorId?.name || "Efron Author"}</span>
                        </p>

                        <button style={{
                            marginTop: "auto", width: "100%", padding: "14px", borderRadius: "14px",
                            background: book.isFree ? "white" : COLORS.primary,
                            color: book.isFree ? "black" : "white",
                            border: "none", fontWeight: "900", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                        }}>
                            {book.isFree ? <Download size={18} /> : <ShoppingBag size={18} />}
                            {book.isFree ? "DOWNLOAD" : "GET ACCESS"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}