"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, BookUp, Library,
    Settings, LogOut, User, Menu, X, ChevronLeft,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    bg: "#1a0621",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
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
            } catch (err) { console.error("Session error"); }
        };
        fetchUser();

        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
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

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: `/${user?.role}` },
        { name: "Publish Book", icon: BookUp, path: `/${user?.role}/e-book-upload` },
        { name: "My Library", icon: Library, path: `/${user?.role}/library` },
        { name: "Settings", icon: Settings, path: "/settings" },
    ];

    return (
        <>
            {/* --- MOBILE HEADER & BURGER --- */}
            {isMobile && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, height: "70px",
                    background: "rgba(26, 6, 33, 0.9)", backdropFilter: "blur(10px)",
                    borderBottom: `1px solid ${COLORS.border}`, zIndex: 120,
                    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ background: COLORS.primary, padding: "8px", borderRadius: "10px" }}>
                            <Sparkles size={18} color="white" />
                        </div>
                        <span style={{ fontWeight: "900", color: COLORS.accent, letterSpacing: "1px" }}>E-Book</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ background: COLORS.glass, border: `1px solid ${COLORS.border}`, padding: "10px", borderRadius: "12px", color: "white" }}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            )}

            {/* --- SIDEBAR --- */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? "280px" : "85px",
                    x: isMobile && !isOpen ? -300 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    height: "100vh", position: "fixed", left: 0, top: 0,
                    background: COLORS.bg, borderRight: `1px solid ${COLORS.border}`,
                    display: "flex", flexDirection: "column", padding: "25px 15px",
                    zIndex: 130, boxShadow: "10px 0 30px rgba(0,0,0,0.5)"
                }}
            >
                {/* 1. TOP SECTION: USER IDENTITY */}
                <div style={{
                    marginBottom: "35px", padding: "12px", borderRadius: "20px",
                    background: isOpen ? COLORS.glass : "transparent",
                    border: isOpen ? `1px solid ${COLORS.border}` : "1px solid transparent",
                    display: "flex", alignItems: "center", gap: "12px", position: "relative"
                }}>
                    <div style={{
                        minWidth: "45px", height: "45px", borderRadius: "14px",
                        background: `linear-gradient(135deg, ${COLORS.primary}, #6a0572)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 15px ${COLORS.primary}40`
                    }}>
                        <User size={22} color="white" />
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                style={{ overflow: "hidden" }}
                            >
                                <p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "white", whiteSpace: "nowrap" }}>
                                    {user?.id || "Mariya Efron"}
                                </p>
                                <p style={{ margin: 0, fontSize: "10px", color: COLORS.primary, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    {user?.role || "Author"} Mode
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. MIDDLE SECTION: NAVIGATION */}
                <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p style={{
                        fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.2)",
                        marginLeft: "15px", marginBottom: "5px", textTransform: "uppercase",
                        display: isOpen ? "block" : "none"
                    }}>Main Menu</p>

                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                                <motion.div
                                    whileHover={{ x: 5, background: "rgba(217, 2, 238, 0.05)" }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "15px", padding: "14px 18px", borderRadius: "16px",
                                        background: isActive ? "rgba(217, 2, 238, 0.1)" : "transparent",
                                        color: isActive ? "white" : "rgba(255,255,255,0.4)",
                                        border: isActive ? `1px solid ${COLORS.border}` : "1px solid transparent",
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

                {/* 3. BOTTOM SECTION: ACTIONS */}
                <div style={{ marginTop: "auto", borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px" }}>
                    {!isMobile && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: "15px",
                                padding: "12px 18px", borderRadius: "12px", background: "transparent",
                                border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", marginBottom: "10px"
                            }}
                        >
                            <motion.div animate={{ rotate: isOpen ? 0 : 180 }}><ChevronLeft size={20} /></motion.div>
                            {isOpen && <span style={{ fontSize: "13px" }}>Collapse View</span>}
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: "15px",
                            padding: "14px 18px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.05)",
                            border: "1px solid rgba(239, 68, 68, 0.1)", color: "#f87171", cursor: "pointer"
                        }}
                    >
                        <LogOut size={20} />
                        {isOpen && <span style={{ fontSize: "14px", fontWeight: "800" }}>Log Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 125 }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}