"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, ExternalLink, Link, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const router = useRouter(); // ✅ add this


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
        <div className="w-full">
            <header className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                    My <span className="text-[#d902ee]">Library</span>
                </h1>
                <p className="mt-2 font-medium text-white/40">Access your digital publications and active requests.</p>
            </header>

            {purchases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/[0.02] border border-dashed border-[#d902ee44] rounded-[2.5rem] text-center">
                    <div className="w-20 h-20 bg-[#d902ee11] rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={32} className="text-[#d902ee]" />
                    </div>
                    <p className="font-bold tracking-widest uppercase text-white/30">No publications in your archive</p>
                    <Link href="/" className="mt-6 text-[#ffd79d] hover:text-[#d902ee] transition-colors font-black text-sm border-b border-[#ffd79d]">
                        EXPLORE THE NEXUS STORE
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {purchases.map((item: any, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white/[0.03] border border-[#d902ee22] hover:border-[#d902ee88] p-4 rounded-[2rem] flex flex-col transition-all duration-300"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-black shadow-2xl">
                                <img
                                    src={item.bookId?.coverImage || "/placeholder.jpg"}
                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.status !== "paid" ? "grayscale opacity-30" : ""}`}
                                    alt="Cover"
                                />
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl
                                ${item.status === "paid" ? "bg-[#00ffcc] text-black" : "bg-[#ffd79d] text-black"}`}>
                                    {item.status}
                                </div>
                            </div>

                            <div className="flex-1 px-2 pb-2">
                                <h3 className="text-lg font-black tracking-tight text-white uppercase truncate">{item.bookId?.title}</h3>
                                <p className="text-[10px] text-white/30 font-mono mt-1">ID: {item.transactionId?.slice(-8)}</p>
                            </div>

                            {item.status === "paid" ? (
                                <button
                                    onClick={() => router.push(`/library/${item.bookId._id}`)}
                                    className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#ffd79d] transition-colors flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={14} /> Open Reader
                                </button>
                            ) : (
                                <div className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-white/20 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <Clock size={14} /> Verification Pending
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}