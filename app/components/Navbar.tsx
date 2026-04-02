"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#320d3e]/90 border-b border-purple-500/20">
                <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">

                    {/* LOGO */}
                    <Link href="/">
                        <h1 className="text-xl font-black tracking-widest text-[#ffd79d]">
                            NEXUS
                        </h1>
                    </Link>

                    {/* DESKTOP */}
                    <div className="items-center hidden gap-8 text-sm font-semibold tracking-wide uppercase md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`transition ${pathname === link.path
                                    ? "text-[#d902ee]"
                                    : "text-white/70 hover:text-[#d902ee]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <Link
                            href="/login"
                            className="px-5 py-2 rounded-full bg-[#d902ee] text-white text-xs font-bold hover:scale-105 transition"
                        >
                            LOGIN
                        </Link>
                    </div>

                    {/* HAMBURGER */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="z-50 flex flex-col gap-1 md:hidden"
                    >
                        <span
                            className={`w-6 h-[2px] bg-[#ffd79d] transition ${isOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`w-6 h-[2px] bg-[#ffd79d] transition ${isOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`w-6 h-[2px] bg-[#ffd79d] transition ${isOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#1a0521] z-40 flex flex-col justify-center px-10 gap-8"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-3xl font-black ${pathname === link.path
                                    ? "text-[#d902ee]"
                                    : "text-white"
                                    }`}
                            >
                                {link.name}

                            </Link>
                        ))}

                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="mt-6 text-center py-4 rounded-xl bg-[#d902ee] text-white font-bold"
                        >
                            SIGN IN
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}