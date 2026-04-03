"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ExternalLink, Loader2, User as UserIcon, BookOpen, IndianRupee } from "lucide-react";

export default function VerifyPaymentPage() {
    const [purchases, setPurchases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Ensure this matches your route folder name: /api/admin/purchase or /api/admin/verify-payment
    const API_URL = "/api/admin/verify-payment";

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/verify-payment"); // Verify this URL!

            // DEBUG STEP: Check the content type
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Expected JSON but got:", text.substring(0, 100));
                return;
            }

            const data = await res.json();
            if (data.success) setPurchases(data.purchases);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchData(); }, []);

    const updateStatus = async (purchaseId: string, status: string) => {
        const res = await fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ purchaseId, status }),
        });
        if (res.ok) fetchData();
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#320d3e]">
            <Loader2 className="animate-spin text-[#d902ee]" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#320d3e] p-4 md:p-8 text-white pb-20 md:pb-8">
            <header className="mb-8 mt-14 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-[#ffd79d]">Payment Verification</h1>
                <p className="text-sm md:text-base text-white/60">Review manual book purchases</p>
            </header>

            <div className="grid max-w-6xl gap-6 mx-auto">
                {purchases.map((p, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={p._id}
                        className="overflow-hidden border shadow-xl bg-white/5 border-white/10 rounded-2xl"
                    >
                        {/* Status Ribbon for Mobile - only visible on small screens */}
                        <div className={`md:hidden px-4 py-2 text-center text-xs font-bold uppercase tracking-widest ${p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            p.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            Status: {p.status}
                        </div>

                        <div className="flex flex-col gap-6 p-5 md:grid md:grid-cols-3 md:p-6">

                            {/* Section 1: Buyer Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[#ffd79d] font-semibold text-sm">
                                    <UserIcon size={16} /> <span>Buyer Details</span>
                                </div>
                                <div className="p-3 border bg-black/10 rounded-xl border-white/5">
                                    <p className="text-base font-medium text-white">{p.userId?.name || "Unknown User"}</p>
                                    <p className="text-xs truncate text-white/50">{p.userId?.email}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#d902ee]/10 border border-[#d902ee]/20">
                                    <p className="text-[10px] uppercase text-white/40 font-bold mb-1">Transaction Ref</p>
                                    <p className="font-mono text-sm text-[#ffd79d] break-all">{p.transactionId}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xl font-black text-white">
                                        <IndianRupee size={18} /> {p.amount}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Book Info (Horizontal divider on mobile) */}
                            <div className="pt-5 space-y-3 border-t md:border-t-0 md:border-l border-white/10 md:pt-0 md:pl-6">
                                <div className="flex items-center gap-2 text-[#ffd79d] font-semibold text-sm">
                                    <BookOpen size={16} /> <span>Book & Author</span>
                                </div>
                                <p className="text-base font-bold leading-tight text-white">{p.bookId?.title}</p>
                                <div className="p-3 border rounded-xl bg-white/5 border-white/5">
                                    <p className="text-[10px] uppercase text-white/40 mb-1 font-bold">Author</p>
                                    <p className="text-sm font-medium">{p.bookId?.authorId?.name}</p>
                                    <p className="text-xs text-white/50">{p.bookId?.authorId?.email}</p>
                                </div>
                            </div>

                            {/* Section 3: Actions (Horizontal divider on mobile) */}
                            <div className="flex flex-col justify-between pt-5 border-t md:border-t-0 md:border-l border-white/10 md:pt-0 md:pl-6">
                                {/* Desktop Status Badge */}
                                <span className={`hidden md:inline-block self-end px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    p.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {p.status}
                                </span>

                                <div className="w-full mt-2 space-y-3">
                                    {p.paymentScreenshot && (
                                        <a
                                            href={p.paymentScreenshot}
                                            target="_blank"
                                            className="flex items-center justify-center w-full gap-2 py-3 text-sm font-semibold transition-all border bg-white/10 hover:bg-white/20 rounded-xl border-white/10"
                                        >
                                            <ExternalLink size={16} /> View Screenshot
                                        </a>
                                    )}

                                    {p.status === 'pending' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => updateStatus(p._id, 'completed')}
                                                className="flex items-center justify-center gap-2 py-3 font-bold text-white transition-all bg-green-500 hover:bg-green-600 rounded-xl active:scale-95"
                                            >
                                                <Check size={20} /> Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(p._id, 'rejected')}
                                                className="flex items-center justify-center gap-2 py-3 font-bold text-white transition-all bg-red-500 hover:bg-red-600 rounded-xl active:scale-95"
                                            >
                                                <X size={20} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                ))}

                {purchases.length === 0 && (
                    <div className="py-20 text-center border border-dashed bg-white/5 rounded-3xl border-white/10">
                        <p className="text-white/40">No payment records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}