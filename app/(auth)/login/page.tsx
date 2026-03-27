// /app/(auth)/login/page.tsx

"use client";

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        } else {
            alert(data.error);
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f3f4f6"
        }}>
            <div style={{
                width: "320px",
                backgroundColor: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ marginBottom: "10px" }}>Login</h2>

                <input
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ddd"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ddd"
                    }}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        marginTop: "14px",
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#4F46E5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}