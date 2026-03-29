"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const THEME = {
    primary: "#d902ee",
    peach: "#ffd79d",
    deepBg: "#1a0521", // This is the solid color
    glass: "rgba(50, 13, 62, 0.85)",
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!mounted) return null;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Library", path: "/user" },
        { name: "Authors", path: "/author" },
        { name: "Admin", path: "/admin" },
    ];

    return (
        <>
            <nav style={{
                position: "fixed", top: 0, width: "100%", zIndex: 1000,
                backdropFilter: "blur(15px)", backgroundColor: THEME.glass,
                borderBottom: `1px solid ${THEME.primary}22`,
            }}>
                <div style={{
                    maxWidth: "1400px", margin: "0 auto", display: "flex",
                    justifyContent: "space-between", alignItems: "center", padding: "16px 5%"
                }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <h1 style={{ fontSize: "22px", fontWeight: "900", color: THEME.peach, letterSpacing: "2px", margin: 0 }}>
                            NEXUS
                        </h1>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <div style={{ display: "flex", gap: "30px", alignItems: "center" }} className="desktop-only">
                        {navLinks.map((link) => (
                            <Link key={link.path} href={link.path} style={{
                                textDecoration: "none", fontSize: "13px", fontWeight: "700",
                                color: pathname === link.path ? THEME.primary : "rgba(255,255,255,0.7)",
                                textTransform: "uppercase", letterSpacing: "1px"
                            }}>
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/login" style={{
                            padding: "10px 22px", borderRadius: "50px", backgroundColor: THEME.primary,
                            color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "12px"
                        }}>LOGIN</Link>
                    </div>

                    {/* BURGER BUTTON */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ background: "none", border: "none", cursor: "pointer", zIndex: 2001, position: "relative" }}
                        className="mobile-only"
                    >
                        <div style={{ width: "25px", height: "2px", backgroundColor: THEME.peach, marginBottom: "5px", transform: isOpen ? "rotate(45deg) translateY(10px)" : "none", transition: "0.3s" }} />
                        <div style={{ width: "25px", height: "2px", backgroundColor: THEME.peach, marginBottom: "5px", opacity: isOpen ? 0 : 1, transition: "0.2s" }} />
                        <div style={{ width: "25px", height: "2px", backgroundColor: THEME.peach, transform: isOpen ? "rotate(-45deg) translateY(-10px)" : "none", transition: "0.3s" }} />
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU - Moved outside <nav> to prevent parent transparency inheritance */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: THEME.deepBg, // SOLID COLOR
                            zIndex: 1500, // Above everything but the burger button
                            padding: "120px 40px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "30px",
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    textDecoration: "none",
                                    fontSize: "32px",
                                    fontWeight: "900",
                                    color: pathname === link.path ? THEME.primary : "white"
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: "20px",
                                borderRadius: "12px",
                                backgroundColor: THEME.primary,
                                color: "white",
                                textDecoration: "none",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "18px",
                                marginTop: "20px"
                            }}
                        >
                            SIGN IN
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                }
                @media (min-width: 769px) {
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </>
    );
}