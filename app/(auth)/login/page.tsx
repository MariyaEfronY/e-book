"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import router from "next/router";

const THEME = {
    bg: "#320d3e",
    primary: "#d902ee",
    softPurple: "#f162ff",
    peach: "#ffd79d",
};

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            // 🛡️ ROLE-BASED REDIRECTION
            const role = data.role.toLowerCase();

            if (role === "admin") {
                window.location.href = "/admin";
            } else if (role === "author") {
                window.location.href = "/author";
            } else {
                window.location.href = "/user";
            }
        } else {
            alert(data.error);
        }
    };

    return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            minHeight: "100vh", backgroundColor: THEME.bg, padding: "20px"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: "100%", maxWidth: "400px", backgroundColor: "rgba(255,255,255,0.03)",
                    padding: "40px", borderRadius: "24px", border: `1px solid ${THEME.primary}44`,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.5)`, textAlign: "center"
                }}
            >
                <h2 style={{ color: THEME.peach, fontSize: "28px", fontWeight: "900", marginBottom: "8px" }}>
                    Welcome Back
                </h2>
                <p style={{ color: THEME.softPurple, fontSize: "14px", marginBottom: "32px" }}>
                    Access your professional dashboard
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: "100%", padding: "14px", borderRadius: "12px",
                            backgroundColor: "rgba(0,0,0,0.2)", border: `1px solid ${THEME.primary}22`,
                            color: "white", outline: "none", fontSize: "16px"
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                        style={{
                            width: "100%", padding: "14px", borderRadius: "12px",
                            backgroundColor: "rgba(0,0,0,0.2)", border: `1px solid ${THEME.primary}22`,
                            color: "white", outline: "none", fontSize: "16px"
                        }}
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            marginTop: "10px", width: "100%", padding: "16px",
                            backgroundColor: THEME.primary, color: "#fff",
                            border: "none", borderRadius: "12px", cursor: "pointer",
                            fontWeight: "bold", fontSize: "16px", transition: "0.3s"
                        }}
                    >
                        {loading ? "Authenticating..." : "Login to Nexus"}
                    </button>
                </div>

                <p style={{ marginTop: "25px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                    Don't have an account? <a href="/register" style={{ color: THEME.peach, textDecoration: "none" }}>Register</a>
                </p>
            </motion.div>
        </div>
    );
}