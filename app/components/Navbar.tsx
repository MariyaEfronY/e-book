// /components/Navbar.tsx

"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
            <h1 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#4F46E5"
            }}>
                E-Book
            </h1>

            <div style={{
                display: "flex",
                gap: "20px",
                fontSize: "14px"
            }}>
                <Link href="/">Home</Link>
                <Link href="/library">Library</Link>
                <Link href="/author">Author</Link>
                <Link href="/admin">Admin</Link>
            </div>
        </div>
    );
}