"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, Loader2, BookOpen, AlertCircle } from "lucide-react";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function AdminBooksPublish() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/books");
            const data = await res.json();
            if (data.success) setBooks(data.books || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div style={{ color: "white" }}>
            <div style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "900", margin: 0 }}>Book Approvals</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                    Review and manage incoming e-book submissions
                </p>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
                    <Loader2 className="animate-spin" color={COLORS.primary} size={40} />
                </div>
            ) : books.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "60px", background: COLORS.glass,
                    borderRadius: "24px", border: `1px solid ${COLORS.border}`
                }}>
                    <BookOpen size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: "15px" }} />
                    <p style={{ opacity: 0.5 }}>No books are currently pending review.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <AnimatePresence>
                        {books.map((book) => (
                            <AdminBookRow key={book._id} book={book} onUpdate={fetchBooks} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENT: AdminBookRow ---
function AdminBookRow({ book, onUpdate }: { book: any; onUpdate: () => void }) {
    const [actionLoading, setActionLoading] = useState(false);

    // 🛡️ CRITICAL GUARD: Stop the "undefined" error before it starts
    if (!book) return null;

    const handleStatusUpdate = async (status: "approved" | "rejected") => {
        let reason = "";
        if (status === "rejected") {
            reason = prompt("Please provide a reason for rejection:") || "";
            if (!reason) return; // Cancel if no reason provided
        }

        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/books", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book._id, status, rejectionReason: reason }),
            });
            if (res.ok) onUpdate();
        } catch (err) {
            alert("Failed to update book status.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px", background: COLORS.glass, borderRadius: "20px",
                border: `1px solid ${COLORS.border}`, backdropFilter: "blur(10px)"
            }}
        >
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {/* Guarded Image with Fallback */}
                <div style={{
                    width: "60px", height: "85px", borderRadius: "10px",
                    overflow: "hidden", background: "#000", border: "1px solid rgba(255,255,255,0.1)"
                }}>
                    <img
                        src={book?.coverImage || "https://via.placeholder.com/150x200?text=No+Cover"}
                        alt={book?.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "white" }}>
                        {book?.title || "Untitled Document"}
                    </h3>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: COLORS.accent, fontWeight: "600" }}>
                        By {book?.authorId?.name || "Unknown Author"}
                    </p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <span style={{
                            fontSize: "10px", padding: "4px 8px", borderRadius: "6px",
                            background: book?.isFree ? "rgba(74, 222, 128, 0.1)" : "rgba(217, 2, 238, 0.1)",
                            color: book?.isFree ? "#4ade80" : COLORS.primary, border: "1px solid currentColor"
                        }}>
                            {book?.isFree ? "FREE" : `₹${book?.price}`}
                        </span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                            ID: {book?._id?.slice(-6)}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {/* PDF PREVIEW BUTTON */}
                <a
                    href={book?.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
                        background: "rgba(255,255,255,0.05)", borderRadius: "12px",
                        color: "white", textDecoration: "none", fontSize: "13px", fontWeight: "bold",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}
                >
                    <Eye size={16} /> View PDF
                </a>

                {book?.status === "pending" && (
                    <div style={{ display: "flex", gap: "8px", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "15px" }}>
                        <button
                            onClick={() => handleStatusUpdate("approved")}
                            disabled={actionLoading}
                            style={{
                                background: "#22c55e", color: "white", border: "none",
                                width: "42px", height: "42px", borderRadius: "12px", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                        >
                            {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={20} />}
                        </button>
                        <button
                            onClick={() => handleStatusUpdate("rejected")}
                            disabled={actionLoading}
                            style={{
                                background: "#ef4444", color: "white", border: "none",
                                width: "42px", height: "42px", borderRadius: "12px", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                        >
                            {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <X size={20} />}
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}