"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ Corrected for App Router
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookCopy, PlusCircle, Settings, Menu, X, LogOut } from "lucide-react";

const COLORS = {
    bg: "#0d0214",
    primary: "#d902ee",
    accent: "#ffd79d",
    border: "rgba(217, 2, 238, 0.2)",
};

export default function UserSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter(); // ✅ Initialize router

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "My Books", path: "/user/buyed-books", icon: <BookCopy size={20} /> },
        { name: "Add Projects", path: "/admin/projectcreation", icon: <PlusCircle size={20} /> },
        { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
    ];

    // 🔥 LOGOUT PROTOCOL
    const handleLogout = async () => {
        // const confirmLogout = window.confirm("Are you sure you want to end your session?");
        // if (!confirmLogout) return;

        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                // Clear any local storage if needed
                router.push("/login");
            } else {
                alert("Session termination failed. Please try again.");
            }
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Network error. Could not reach server.");
        }
    };

    return (
        <>
            {/* 📱 MOBILE HEADER TOGGLE */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-[#0d0214]/90 backdrop-blur-xl border-b border-[#d902ee22] p-4 z-[100] flex justify-between items-center shadow-2xl">
                <h2 className="text-[#ffd79d] font-black tracking-tighter text-xl">NEXUS.OS</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-[#d902ee] rounded-lg text-white shadow-[0_0_15px_rgba(217,2,238,0.4)]"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* 🌫️ MOBILE BACKDROP */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* 🏛️ SIDEBAR COMPONENT */}
            <aside className={`
                fixed top-0 left-0 h-screen w-[280px] bg-[#0d0214] border-r border-[#d902ee22] 
                flex flex-col z-[90] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 md:sticky
            `}>
                <div className="p-10 border-b border-[#d902ee11]">
                    <h2 className="text-[#ffd79d] font-black text-2xl tracking-tighter">
                        NEXUS<span className="text-white/20">.OS</span>
                    </h2>
                    <p className="text-[10px] text-[#d902ee] font-bold tracking-[0.3em] mt-1 uppercase">User Protocol</p>
                </div>

                <nav className="flex-1 p-6 mt-4 space-y-2">
                    {navItems.map((item) => {
                        const active = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                                <motion.div
                                    whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.03)" }}
                                    className={`
                                        flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                                        ${active
                                            ? "bg-[#d902ee11] border-[#d902ee44] text-[#ffd79d] shadow-[inset_0_0_20px_rgba(217,2,238,0.1)]"
                                            : "border-transparent text-white/40 hover:text-white"}
                                    `}
                                >
                                    <span className={active ? "text-[#d902ee]" : "text-white/20"}>{item.icon}</span>
                                    <span className="text-xs font-black tracking-[0.1em] uppercase">{item.name}</span>
                                    {active && (
                                        <motion.div
                                            layoutId="activeSideGlow"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d902ee] shadow-[0_0_10px_#d902ee]"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* 🔒 LOGOUT SECTION */}
                <div className="p-6 border-t border-[#d902ee11] bg-black/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-4 p-4 text-[11px] font-black tracking-[0.2em] uppercase transition-all text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl group"
                    >
                        <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}