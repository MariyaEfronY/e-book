"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
    bg: "#320d3e",
    primary: "#d902ee",
    accent: "#ffd79d",
};

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: "📊" },
        { name: "Certificates", path: "/admin/certificate-all", icon: "📜" },
        { name: "Add Projects", path: "/admin/projectcreation", icon: "➕" },
        { name: "Settings", path: "/admin/settings", icon: "⚙️" },
    ];
    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            // 🔁 Redirect to login
            window.location.href = "/login";
        } catch {
            alert("Logout failed");
        }
    };

    return (
        <>
            {/* Mobile Burger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: "fixed", top: "15px", left: "15px", zIndex: 100, backgroundColor: COLORS.primary, border: "none", padding: "10px", borderRadius: "8px" }}
                className="md:hidden"
            >
                {isOpen ? "✕" : "☰"}
            </button>

            <aside style={{
                width: "280px", height: "100vh", backgroundColor: COLORS.bg,
                borderRight: `1px solid ${COLORS.primary}33`, display: "flex", flexDirection: "column",
                position: "fixed", left: 0, top: 0, transition: "transform 0.3s ease",
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                zIndex: 90
            }} className="md:translate-x-0 md:static">

                <div style={{ padding: "40px 20px", textAlign: "center", borderBottom: `1px solid ${COLORS.primary}22` }}>
                    <h2 style={{ color: COLORS.accent, letterSpacing: "2px", fontSize: "1.5rem" }}>ADMIN</h2>
                </div>

                <nav style={{ flex: 1, padding: "20px" }}>
                    {navItems.map((item) => {
                        const active = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
                                <div style={{
                                    padding: "15px", borderRadius: "12px", marginBottom: "10px",
                                    display: "flex", alignItems: "center", gap: "15px",
                                    backgroundColor: active ? `${COLORS.primary}22` : "transparent",
                                    border: active ? `1px solid ${COLORS.primary}` : "1px solid transparent",
                                    color: active ? COLORS.accent : "#fff"
                                }}>
                                    <span>{item.icon}</span>
                                    <span style={{ fontWeight: active ? "bold" : "normal" }}>{item.name}</span>
                                </div>
                                <div><button onClick={handleLogout}>
                                    Logout
                                </button></div>
                            </Link>

                        );
                    })}
                </nav>
            </aside>

            <style jsx global>{`
        @media (min-width: 768px) {
          .md\:hidden { display: none !important; }
          aside { transform: none !important; position: sticky !important; }
        }
      `}</style>
        </>
    );
}