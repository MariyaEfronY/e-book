"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, User, BookOpen, Clock, CheckCircle2 } from "lucide-react";

// 1. Define the Interface to fix the TypeScript "never[]" error
interface PurchaseRequest {
    _id: string;
    userId: {
        name: string;
        email: string;
    };
    bookId: {
        title: string;
        price: number;
    };
    amount: number;
    transactionId: string;
    status: "pending" | "completed" | "rejected";
}

const THEME = {
    bg: "#0d0214",
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function AdminVerifyPage() {
    // 2. Properly type the state
    const [allRequests, setAllRequests] = useState<PurchaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/purchases");
            const data = await res.json();
            if (data.success) {
                setAllRequests(data.requests);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        setActionId(id);
        try {
            const res = await fetch("/api/admin/purchases", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchaseId: id })
            });

            if (res.ok) {
                // ✅ This update logic is now Type-Safe
                setAllRequests((prev) =>
                    prev.map((req) =>
                        req._id === id ? { ...req, status: "completed" } : req
                    )
                );
            } else {
                alert("Server error during approval");
            }
        } catch (err) {
            alert("Network error. Please try again.");
        } finally {
            setActionId(null);
        }
    };

    const pending = allRequests.filter((r) => r.status === "pending");
    const completed = allRequests.filter((r) => r.status === "completed");

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: THEME.bg }}>
            <Loader2 className="animate-spin" size={40} color={THEME.primary} />
        </div>
    );

    return (
        <main style={{ minHeight: "100vh", background: THEME.bg, padding: "40px 20px", color: "white" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

                <header style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Clock color={THEME.accent} size={24} />
                    <h2 style={{ fontSize: "24px", fontWeight: "900", color: THEME.accent }}>Pending Verification ({pending.length})</h2>
                </header>

                <div style={{ display: "grid", gap: "15px", marginBottom: "60px" }}>
                    <AnimatePresence mode="popLayout">
                        {pending.length === 0 ? (
                            <p style={{ color: "rgba(255,255,255,0.2)", padding: "20px" }}>No pending requests.</p>
                        ) : (
                            pending.map((req) => (
                                <RequestCard
                                    key={req._id}
                                    req={req}
                                    onApprove={handleApprove}
                                    isProcessing={actionId === req._id}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                <hr style={{ border: "none", borderTop: `1px solid ${THEME.border}`, marginBottom: "40px" }} />

                <header style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 color="#00ffcc" size={24} />
                    <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#00ffcc" }}>Approved History ({completed.length})</h2>
                </header>

                <div style={{ display: "grid", gap: "15px", opacity: 0.8 }}>
                    {completed.map((req) => (
                        <RequestCard key={req._id} req={req} isHistory />
                    ))}
                </div>
            </div>
        </main>
    );
}

// 🎴 Reusable Card Component with Prop Typing
interface CardProps {
    req: PurchaseRequest;
    onApprove?: (id: string) => void;
    isProcessing?: boolean;
    isHistory?: boolean;
}

function RequestCard({ req, onApprove, isProcessing, isHistory }: CardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 50 }}
            style={{
                background: THEME.glass, padding: "20px",
                borderRadius: "16px", border: `1px solid ${isHistory ? "rgba(0,255,204,0.1)" : THEME.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                backdropFilter: "blur(10px)"
            }}
        >
            <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
                <div style={{ width: "200px" }}>
                    <div style={{ color: THEME.accent, fontWeight: "800", fontSize: "14px" }}>{req.userId?.name || "Unknown User"}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{req.userId?.email}</div>
                </div>

                <div style={{ width: "200px" }}>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>{req.bookId?.title || "Deleted Book"}</div>
                    <div style={{ color: THEME.primary, fontWeight: "900" }}>₹{req.amount}</div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", display: "block" }}>REF NO.</span>
                    <code style={{ color: isHistory ? "#00ffcc" : "#fff", fontWeight: "bold" }}>{req.transactionId}</code>
                </div>
            </div>

            {!isHistory && onApprove && (
                <button
                    onClick={() => onApprove(req._id)}
                    disabled={isProcessing}
                    style={{
                        background: THEME.primary, color: "white", border: "none",
                        padding: "10px 20px", borderRadius: "10px", fontWeight: "900",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                        transition: "all 0.2s ease"
                    }}
                >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    APPROVE
                </button>
            )}

            {isHistory && (
                <div style={{ color: "#00ffcc", fontSize: "12px", fontWeight: "900", display: "flex", alignItems: "center", gap: "5px" }}>
                    <CheckCircle2 size={16} /> VERIFIED
                </div>
            )}
        </motion.div>
    );
}