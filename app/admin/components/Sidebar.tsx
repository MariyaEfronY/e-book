"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    CheckCircle,
    BookPlus,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";

const COLORS = {
    bg: "#f8fafc",        // Light Slate Gray
    sidebar: "#ffffff",   // Pure White
    primary: "#6366f1",   // Indigo
    text: "#1e293b",      // Dark Slate
    border: "#e2e8f0",    // Light border
};

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: "Dashboard", path: "/admin/books", icon: <LayoutDashboard size={20} /> },
        { name: "Verification", path: "/admin/verify-payment", icon: <CheckCircle size={20} /> },
        { name: "Publish Books", path: "/admin/books-publish", icon: <BookPlus size={20} /> },
        { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) router.push("/login");
        } catch {
            alert("Logout failed");
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            {/* Brand Header */}
            <div className="p-6 border-b border-slate-100">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-2"
                >
                    <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-indigo-600 rounded-lg">
                        A
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">
                        AdminPanel
                    </h2>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                            <motion.div
                                whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-indigo-50 rounded-xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className={`z-10 transition-colors ${active ? "text-indigo-600" : "text-slate-400"}`}>
                                    {item.icon}
                                </span>
                                <span className="z-10 text-sm font-semibold">{item.name}</span>
                                {active && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute right-3 w-1.5 h-1.5 bg-indigo-600 rounded-full z-10"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 mt-auto border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 px-4 py-3 transition-all text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl group"
                >
                    <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
                    <span className="text-sm font-semibold">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="fixed top-0 left-0 z-[100] w-full p-4 md:hidden bg-white/80 backdrop-blur-md flex justify-between items-center border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center text-xs font-bold text-white bg-indigo-600 rounded w-7 h-7">A</div>
                    <h2 className="font-bold text-slate-800">ADMIN</h2>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[80] bg-slate-900/20 backdrop-blur-sm md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Shell */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed top-0 left-0 z-[90] w-[280px] h-screen bg-white border-r border-slate-200 md:translate-x-0 md:static md:block`}
            >
                <SidebarContent />
            </motion.aside>

            {/* Global CSS for responsiveness fix */}
            <style jsx global>{`
                body {
                    background-color: #f8fafc; /* Matches slate-50 */
                }
                @media (min-width: 768px) {
                    aside {
                        transform: none !important;
                        position: sticky !important;
                        min-width: 280px;
                    }
                }
            `}</style>
        </>
    );
}