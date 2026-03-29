// /app/(main)/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import BookCard from "../components/BookCard";

// export default function HomePage() {
//     const [books, setBooks] = useState([]);

//     useEffect(() => {
//         fetch("/api/books")
//             .then(res => res.json())
//             .then(setBooks);
//     }, []);

//     return (
//         <div style={{
//             backgroundColor: "#f3f4f6",
//             minHeight: "100vh"
//         }}>
//             <Navbar />

//             <div style={{
//                 padding: "24px",
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//                 gap: "20px"
//             }}>
//                 {books.map((book: any) => (
//                     <BookCard key={book._id} book={book} />
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, ShoppingBag, Loader2 } from "lucide-react";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    bg: "#13041a",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function HomePage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveBooks = async () => {
            try {
                // 1. Check this path! Does it match your file structure?
                const res = await fetch("/api/public-users");

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error(`Error ${res.status}: ${errorText}`);
                    return;
                }

                const data = await res.json();
                if (data.success) setBooks(data.books);
            } catch (err) {
                console.error("Network or Syntax Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveBooks();
    }, []);

    if (loading) {
        return (
            <div style={{ height: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 className="animate-spin" color={COLORS.primary} size={40} />
            </div>
        );
    }

    return (
        <main style={{ minHeight: "100vh", background: COLORS.bg, padding: "80px 20px", color: "white" }}>
            {/* Hero Header */}
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: "3.5rem", fontWeight: "900", letterSpacing: "-1px" }}
                >
                    EFRON.<span style={{ color: COLORS.primary }}>LIBRARY</span>
                </motion.h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem" }}>
                    Premium digital resources, verified and published for you.
                </p>
            </div>

            {/* Books Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "30px",
                maxWidth: "1200px",
                margin: "0 auto"
            }}>
                {books.map((book: any, i) => (
                    <motion.div
                        key={book._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
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
                        {/* Cover Image */}
                        <div style={{
                            height: "350px", borderRadius: "15px", overflow: "hidden",
                            marginBottom: "20px", position: "relative"
                        }}>
                            <img src={book.coverImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div style={{
                                position: "absolute", top: "12px", right: "12px",
                                background: "rgba(0,0,0,0.7)", padding: "6px 12px", borderRadius: "10px",
                                color: COLORS.accent, fontWeight: "800", fontSize: "12px", border: `1px solid ${COLORS.border}`
                            }}>
                                {book.isFree ? "FREE" : `₹${book.price}`}
                            </div>
                        </div>

                        {/* Book Info */}
                        <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "800" }}>{book.title}</h3>
                        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                            by <span style={{ color: COLORS.primary, fontWeight: "700" }}>{book.authorId?.name || "Efron Author"}</span>
                        </p>

                        {/* Dynamic Button */}
                        <button style={{
                            marginTop: "auto", width: "100%", padding: "14px", borderRadius: "14px",
                            background: book.isFree ? "white" : COLORS.primary,
                            color: book.isFree ? "black" : "white",
                            border: "none", fontWeight: "900", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                            transition: "0.3s"
                        }}>
                            {book.isFree ? <Download size={18} /> : <ShoppingBag size={18} />}
                            {book.isFree ? "DOWNLOAD NOW" : "BUY ACCESS"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </main>
    );
}