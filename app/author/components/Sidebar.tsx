"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthorSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "My Books", path: "/author", icon: "📚" },
        { name: "Upload Content", path: "/author/e-book-upload", icon: "📤" },
        { name: "Revenue", path: "/author/earnings", icon: "💰" },
    ];

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" style={{ position: "fixed", top: "15px", left: "15px", zIndex: 100, backgroundColor: "#d902ee", border: "none", padding: "10px", borderRadius: "8px" }}>
                {isOpen ? "✕" : "☰"}
            </button>

            <aside style={{ width: "280px", height: "100vh", backgroundColor: "#320d3e", borderRight: "1px solid #d902ee33", position: "fixed", left: 0, top: 0, zIndex: 90, transition: "transform 0.3s ease", transform: isOpen ? "translateX(0)" : "translateX(-100%)" }} className="md:translate-x-0 md:static">
                <div style={{ padding: "40px 20px", textAlign: "center" }}><h2 style={{ color: "#ffd79d" }}>AUTHOR</h2></div>
                <nav style={{ padding: "20px" }}>
                    {navItems.map((item) => (
                        <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
                            <div style={{ padding: "12px", color: pathname === item.path ? "#ffd79d" : "white", border: pathname === item.path ? "1px solid #d902ee" : "none" }}>{item.name}</div>
                        </Link>
                    ))}
                </nav>
            </aside>
            <style jsx global>{` @media (min-width: 768px) { .md\:hidden { display: none; } aside { transform: none !important; position: sticky !important; } } `}</style>
        </>
    );
}