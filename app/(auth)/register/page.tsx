"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

// EXACT Colors from your reference
const THEME = {
    midnight: "#1B263B",    // Deep Navy Blue
    royalGold: "#D4AF37",   // Primary Gold
    darkerNavy: "#0D1B2A",  // Background
    softGold: "#F4D03F",    // Hover Gold
    textGray: "#8D99AE",
};

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");
            router.push("/login?success=Account created");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            backgroundColor: THEME.darkerNavy,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            color: 'white',
            padding: '20px'
        }}>

            {/* Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    backgroundColor: THEME.midnight,
                    border: `1px solid ${THEME.royalGold}44`,
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    zIndex: 10
                }}
            >
                <header style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ color: THEME.royalGold, fontSize: '24px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                        Join the Network
                    </h2>
                    <p style={{ color: THEME.textGray, fontSize: '14px', marginTop: '8px' }}>
                        Create your professional Author or Reader profile
                    </p>
                </header>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: THEME.royalGold, fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Full Name</label>
                        <input
                            required
                            type="text"
                            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'white', outline: 'none' }}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: THEME.royalGold, fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
                        <input
                            required
                            type="email"
                            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'white', outline: 'none' }}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: THEME.royalGold, fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Password</label>
                        <input
                            required
                            type="password"
                            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'white', outline: 'none' }}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: THEME.royalGold, fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Select Role</label>
                        <select
                            style={{ backgroundColor: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'white', outline: 'none', cursor: 'pointer' }}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="user">Reader / User</option>
                            <option value="author">Author</option>
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        style={{
                            backgroundColor: THEME.royalGold,
                            color: THEME.darkerNavy,
                            padding: '16px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        {loading ? "Creating..." : "Register Now"}
                    </motion.button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <p style={{ color: THEME.textGray, fontSize: '13px' }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{ color: THEME.royalGold, fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}