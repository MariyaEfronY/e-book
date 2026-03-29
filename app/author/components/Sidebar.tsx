"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, BookUp, Library,
    Settings, LogOut, User, Menu, X, ChevronLeft,
    Sparkles, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    bg: "#13041a", // Ultra deep purple
    glass: "rgba(255, 255, 255, 0.05)",
    border: "rgba(217, 2, 238, 0.25)",
};

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [user, setUser] = useState<{ id: string, role: string } | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.success) setUser(data.user);
            } catch (err) { console.error("Session fetch failed"); }
        };
        fetchUser();

        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setIsOpen(!mobile); // Default open on desktop, closed on mobile
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        if (res.ok) {
            router.push("/login");
            router.refresh();
        }
    };

    // Helper to close sidebar when a link is clicked on mobile
    const closeOnMobile = () => {
        if (isMobile) setIsOpen(false);
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: `/${user?.role}` },
        { name: "Publish Book", icon: BookUp, path: `/${user?.role}/e-book-upload` },
        { name: "My Library", icon: Library, path: `/${user?.role}/library` },
        { name: "Settings", icon: Settings, path: "/settings" },
    ];

    return (
        <>
            {/* 📱 MOBILE TOP NAV BAR */}
            {isMobile && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, height: "70px",
                    background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, zIndex: 100,
                    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Sparkles color={COLORS.primary} size={20} />
                        <span style={{ fontWeight: "900", color: "white", letterSpacing: "1px" }}>EFRON.OS</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ background: COLORS.glass, border: `1px solid ${COLORS.border}`, padding: "10px", borderRadius: "12px", color: "white" }}
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            )}

            {/* 🏛️ MAIN SIDEBAR */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? "280px" : "85px",
                    x: isMobile && !isOpen ? -300 : 0
                }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                style={{
                    height: "100vh", position: "fixed", left: 0, top: 0,
                    background: COLORS.bg, borderRight: `1px solid ${COLORS.border}`,
                    display: "flex", flexDirection: "column", padding: "20px 15px",
                    zIndex: 200, boxShadow: "15px 0 40px rgba(0,0,0,0.6)"
                }}
            >
                {/* 1. TOP SECTION: USER & ACTIONS (Sign Out moved up) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
                    <div style={{
                        padding: "15px", borderRadius: "20px", background: COLORS.glass,
                        border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "12px"
                    }}>
                        <div style={{
                            minWidth: "42px", height: "42px", borderRadius: "12px",
                            background: `linear-gradient(45deg, ${COLORS.primary}, #7a02ee)`,
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <User size={20} color="white" />
                        </div>
                        {isOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: "hidden" }}>
                                <p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "white", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {user?.id || "Mariya Efron"}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <ShieldCheck size={10} color={COLORS.accent} />
                                    <p style={{ margin: 0, fontSize: "10px", color: COLORS.accent, fontWeight: "bold", textTransform: "uppercase" }}>{user?.role}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Quick Sign Out at Top */}
                    <button
                        onClick={handleLogout}
                        style={{
                            display: "flex", alignItems: "center", gap: "15px", padding: "12px 18px", borderRadius: "14px",
                            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#f87171", cursor: "pointer", width: "100%"
                        }}
                    >
                        <LogOut size={18} />
                        {isOpen && <span style={{ fontSize: "13px", fontWeight: "800" }}>Sign Out</span>}
                    </button>
                </div>

                {/* 2. NAVIGATION LINKS */}
                <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} onClick={closeOnMobile} style={{ textDecoration: "none" }}>
                                <motion.div
                                    whileHover={{ x: 5, background: "rgba(255,255,255,0.03)" }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "15px", padding: "14px 18px", borderRadius: "16px",
                                        background: isActive ? "rgba(217, 2, 238, 0.15)" : "transparent",
                                        border: isActive ? `1px solid ${COLORS.border}` : "1px solid transparent",
                                        color: isActive ? "white" : "rgba(255,255,255,0.4)",
                                        cursor: "pointer", transition: "0.2s"
                                    }}
                                >
                                    <item.icon size={20} color={isActive ? COLORS.primary : "currentColor"} />
                                    {isOpen && <span style={{ fontSize: "14px", fontWeight: isActive ? "800" : "600" }}>{item.name}</span>}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. COLLAPSE TOGGLE (Desktop only) */}
                {!isMobile && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            marginTop: "auto", display: "flex", alignItems: "center", gap: "15px",
                            padding: "15px", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer"
                        }}
                    >
                        <motion.div animate={{ rotate: isOpen ? 0 : 180 }}><ChevronLeft size={20} /></motion.div>
                        {isOpen && <span style={{ fontSize: "12px" }}>Minimize Menu</span>}
                    </button>
                )}
            </motion.aside>

            {/* 🌫️ MOBILE OVERLAY (Click to Close) */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 150 }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}