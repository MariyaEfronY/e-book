"use client";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section style={{ padding: "160px 5% 80px", textAlign: "center", background: "radial-gradient(circle at 50% 0%, #d902ee22 0%, transparent 70%)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: "900", lineHeight: "1.1" }}>
                    Publishing <span style={{ color: "#ffd79d" }}>Redefined</span>
                </h1>
                <p style={{ color: "#f162ff", margin: "20px auto", maxWidth: "600px", opacity: 0.8 }}>
                    A high-fidelity platform for authors and readers in the Nexus ecosystem.
                </p>
                <button style={{ backgroundColor: "#d902ee", color: "white", padding: "16px 40px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }}>
                    Get Started
                </button>
            </motion.div>
        </section>
    );
}