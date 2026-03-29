"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Clock, ExternalLink, Loader2 } from "lucide-react";

const THEME = {
    bg: "#0d0214",
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function UserDashboard() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBooks = async () => {
            const res = await fetch("/api/user/my-books");
            const data = await res.json();
            if (data.success) setPurchases(data.purchases);
            setLoading(false);
        };
        fetchMyBooks();
    }, []);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: THEME.bg }}>
            <Loader2 className="animate-spin" size={40} color={THEME.primary} />
        </div>
    );

    return (
        <main style={{ minHeight: "100vh", background: THEME.bg, color: "white", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <header style={{ marginBottom: "40px" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: "900", color: THEME.accent }}>My Library</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)" }}>Access your purchased and approved digital books.</p>
                </header>

                {purchases.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "100px", background: THEME.glass, borderRadius: "24px", border: `1px solid ${THEME.border}` }}>
                        <BookOpen size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: "20px" }} />
                        <p style={{ color: "rgba(255,255,255,0.3)" }}>You haven't requested any books yet.</p>
                        <a href="/" style={{ color: THEME.primary, textDecoration: "none", fontWeight: "bold", marginTop: "10px", display: "inline-block" }}>Browse Store</a>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
                        {purchases.map((item: any) => (
                            <motion.div
                                key={item._id}
                                whileHover={{ y: -5 }}
                                style={{
                                    background: THEME.glass, borderRadius: "20px", border: `1px solid ${THEME.border}`,
                                    padding: "16px", display: "flex", flexDirection: "column", overflow: "hidden"
                                }}
                            >
                                {/* Cover Image */}
                                <div style={{ height: "280px", borderRadius: "12px", overflow: "hidden", marginBottom: "15px", position: "relative", background: "#000" }}>
                                    <img
                                        src={item.bookId?.coverImage || "https://via.placeholder.com/300x450"}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: item.status === "completed" ? 1 : 0.4 }}
                                        alt="Book Cover"
                                    />

                                    {/* Status Badge */}
                                    <div style={{
                                        position: "absolute", top: "10px", right: "10px",
                                        background: item.status === "completed" ? "#00ffcc" : THEME.accent,
                                        color: "#000", fontSize: "10px", fontWeight: "900", padding: "4px 10px", borderRadius: "20px"
                                    }}>
                                        {item.status.toUpperCase()}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "5px" }}>{item.bookId?.title}</h3>
                                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>Transaction: {item.transactionId}</p>

                                {/* Conditional Button */}
                                {item.status === "completed" ? (
                                    <button
                                        onClick={() => window.open(item.bookId?.fileUrl, "_blank")}
                                        style={{
                                            marginTop: "auto", width: "100%", padding: "12px", borderRadius: "10px",
                                            background: "white", color: "black", border: "none", fontWeight: "900",
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer"
                                        }}
                                    >
                                        <ExternalLink size={16} /> VIEW PDF
                                    </button>
                                ) : (
                                    <div style={{
                                        marginTop: "auto", width: "100%", padding: "12px", borderRadius: "10px",
                                        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)",
                                        border: `1px solid ${THEME.border}`, fontSize: "12px", fontWeight: "700",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                                    }}>
                                        <Clock size={16} /> AWAITING APPROVAL
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}