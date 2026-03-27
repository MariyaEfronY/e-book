// /app/(auth)/register/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                role: "user"
            })
        });

        const data = await res.json();

        if (data.user) {
            alert("Registered successfully");
            router.push("/login");
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
            background: "#f3f4f6"
        }}>
            <div style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                width: "320px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
                <h2>Register</h2>

                <input
                    placeholder="Name"
                    onChange={e => setName(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginTop: "10px" }}
                />

                <input
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginTop: "10px" }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginTop: "10px" }}
                />

                <button
                    onClick={handleRegister}
                    style={{
                        marginTop: "12px",
                        width: "100%",
                        padding: "10px",
                        background: "#4F46E5",
                        color: "#fff",
                        borderRadius: "6px",
                        border: "none"
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
}