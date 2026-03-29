"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const THEME = {
    primary: "#d902ee",
    peach: "#ffd79d",
    deepBg: "#1a0521",
    glass: "rgba(50, 13, 62, 0.95)",
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Lock scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Library", path: "/user" },
        { name: "Authors", path: "/author" },
        { name: "Admin", path: "/admin" },
    ];

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-content">
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <h1 className="logo-text">NEXUS</h1>
                    </Link>

                    {/* DESKTOP LINKS - Handled via CSS Media Queries */}
                    <div className="nav-desktop">
                        {navLinks.map((link) => (
                            <Link key={link.path} href={link.path} style={{
                                textDecoration: "none", fontSize: "13px", fontWeight: "700",
                                color: pathname === link.path ? THEME.primary : "rgba(255,255,255,0.7)",
                                textTransform: "uppercase", letterSpacing: "1px"
                            }}>
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/login" className="login-btn">LOGIN</Link>
                    </div>

                    {/* BURGER BUTTON - Handled via CSS Media Queries */}
                    <button onClick={() => setIsOpen(!isOpen)} className="nav-mobile-btn" aria-label="Toggle Menu">
                        <div style={{
                            width: "25px", height: "2px", backgroundColor: THEME.peach, marginBottom: "5px",
                            transform: isOpen ? "rotate(45deg) translateY(10px)" : "none", transition: "0.3s"
                        }} />
                        <div style={{
                            width: "25px", height: "2px", backgroundColor: THEME.peach, marginBottom: "5px",
                            opacity: isOpen ? 0 : 1, transition: "0.2s"
                        }} />
                        <div style={{
                            width: "25px", height: "2px", backgroundColor: THEME.peach,
                            transform: isOpen ? "rotate(-45deg) translateY(-10px)" : "none", transition: "0.3s"
                        }} />
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU - Opaque and Smooth */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        className="mobile-drawer"
                    >
                        {navLinks.map((link) => (
                            <Link key={link.path} href={link.path} onClick={() => setIsOpen(false)} style={{
                                textDecoration: "none", fontSize: "32px", fontWeight: "900",
                                color: pathname === link.path ? THEME.primary : "white"
                            }}>
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/login" onClick={() => setIsOpen(false)} className="mobile-login-btn">
                            SIGN IN
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .navbar-container {
                    position: fixed; top: 0; width: 100%; z-index: 1000;
                    backdrop-filter: blur(15px); background-color: ${THEME.glass};
                    border-bottom: 1px solid ${THEME.primary}22;
                }
                .navbar-content {
                    max-width: 1400px; margin: 0 auto; display: flex;
                    justify-content: space-between; align-items: center; padding: 16px 5%;
                }
                .logo-text { font-size: 22px; font-weight: 900; color: ${THEME.peach}; letter-spacing: 2px; margin: 0; }
                
                .login-btn {
                    padding: 10px 22px; border-radius: 50px; background-color: ${THEME.primary};
                    color: white; text-decoration: none; font-weight: bold; font-size: 12px;
                }

                .mobile-drawer {
                    position: fixed; top: 0; right: 0; bottom: 0; left: 0;
                    width: 100vw; height: 100vh; 
                    background-color: ${THEME.deepBg} !important; /* Forces solid color */
                    z-index: 1500; padding: 120px 40px; display: flex;
                    flex-direction: column; gap: 30px;
                }

                .mobile-login-btn {
                    padding: 20px; border-radius: 12px; background-color: ${THEME.primary};
                    color: white; text-decoration: none; text-align: center;
                    font-weight: bold; font-size: 18px; margin-top: 20px;
                }

                .nav-mobile-btn { background: none; border: none; cursor: pointer; z-index: 2001; position: relative; display: none; }

                /* RESPONSIVE BREAKPOINTS */
                @media (max-width: 768px) {
                    .nav-desktop { display: none !important; }
                    .nav-mobile-btn { display: block !important; }
                }

                @media (min-width: 769px) {
                    .nav-desktop { display: flex !important; gap: 30px; align-items: center; }
                    .nav-mobile-btn { display: none !important; }
                }
            `}</style>
        </>
    );
}