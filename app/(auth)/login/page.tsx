"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

const THEME = {
    bg: "#320d3e",
    primary: "#d902ee",
    softPurple: "#f162ff",
    peach: "#ffd79d",
};

export default function LoginPageWrapper() {
    return (
        <Suspense fallback={<div style={{ color: "white", textAlign: "center", padding: "50px" }}>Loading...</div>}>
            <LoginPage />
        </Suspense>
    );
}

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // 🎯 Capture the "callbackUrl" (e.g., /checkout/123)
    const callbackUrl = searchParams.get("callbackUrl");

    const handleLogin = async () => {
        if (!email || !password) return alert("Please fill in all fields");

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                // 🚦 REDIRECTION LOGIC
                if (callbackUrl) {
                    // ✅ Use window.location.href for a clean hard-redirect to the checkout
                    window.location.href = decodeURIComponent(callbackUrl);
                    return;
                }

                const role = data.role.toLowerCase();
                if (role === "admin") {
                    window.location.href = "/admin";
                } else if (role === "author") {
                    window.location.href = "/author";
                } else {
                    window.location.href = "/user";
                }
            } else {
                alert(data.error || "Login failed");
            }
        } catch (err) {
            alert("Something went wrong. Try again.");
        } finally {
            setLoading(false);
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
                    {callbackUrl ? "Login to Purchase" : "Welcome Back"}
                </h2>
                <p style={{ color: THEME.softPurple, fontSize: "14px", marginBottom: "32px" }}>
                    {callbackUrl ? "Securely complete your checkout" : "Access your professional dashboard"}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
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
                        value={password}
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
                            border: "none", borderRadius: "12px",
                            cursor: "pointer", // ✅ FIXED: Added Quotes
                            fontWeight: "bold", fontSize: "16px", transition: "0.3s",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Authenticating..." : callbackUrl ? "Continue to Checkout" : "Login to Nexus"}
                    </button>
                </div>

                <p style={{ marginTop: "25px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                    Don't have an account? <a href="/register" style={{ color: THEME.peach, textDecoration: "none" }}>Register</a>
                </p>
            </motion.div>
        </div>
    );
}