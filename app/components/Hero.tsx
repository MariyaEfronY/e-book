"use client";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";


export default function Hero() {
    // Animation Variants for staggered entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
    };

    return (
        <section style={{
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "100px 5%",
            background: "#050505",
            backgroundImage: `
                radial-gradient(circle at 50% 0%, #d902ee15 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, #ffd79d08 0%, transparent 30%)
            `,
            color: "#fff",
            fontFamily: "'Inter', sans-serif", // Clean base font
            overflow: "hidden",
            position: "relative"
        }}>
            {/* Background Decorative Element */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{
                    position: "absolute",
                    width: "400px",
                    height: "400px",
                    background: "#d902ee",
                    filter: "blur(120px)",
                    borderRadius: "50%",
                    top: "-100px",
                    zIndex: 0
                }}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ position: "relative", zIndex: 1, textAlign: "center" }}
            >
                <motion.span variants={itemVariants} style={{
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "4px",
                    color: "#f162ff",
                    marginBottom: "20px",
                    display: "block",
                    fontWeight: "600"
                }}>
                    Nexus Publishing Protocol
                </motion.span>

                <motion.h1 variants={itemVariants} style={{
                    fontSize: "clamp(50px, 10vw, 100px)",
                    fontWeight: "800",
                    lineHeight: "0.95",
                    letterSpacing: "-0.04em",
                    fontFamily: "'Playfair Display', serif", // The "Bookish" font
                }}>
                    Publishing <br />
                    <span style={{
                        background: "linear-gradient(90deg, #ffd79d 0%, #d902ee 50%, #ffd79d 100%)",
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontStyle: "italic",
                        fontWeight: "400"
                    }}>Redefined</span>
                </motion.h1>

                <motion.p variants={itemVariants} style={{
                    color: "#999",
                    margin: "32px auto",
                    maxWidth: "550px",
                    fontSize: "1.25rem",
                    lineHeight: "1.6",
                    fontWeight: "300"
                }}>
                    Where high-fidelity storytelling meets the next generation of the digital shelf.
                </motion.p>

                <motion.div variants={itemVariants} style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 2, 238, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            backgroundColor: "#d902ee",
                            color: "white",
                            padding: "20px 48px",
                            borderRadius: "100px",
                            border: "none",
                            fontWeight: "700",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "box-shadow 0.3s ease"
                        }}
                    >
                        Start Your Journey
                    </motion.button>
                </motion.div>

                {/* Floating Book Mockup with "Breathing" animation */}
                <motion.div
                    variants={itemVariants}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "anticipate" }}
                    style={{ marginTop: "60px" }}
                >
                    <div style={{
                        width: "240px",
                        height: "320px",
                        margin: "0 auto",
                        background: "linear-gradient(135deg, #1a1a1a 0%, #000 100%)",
                        borderRadius: "4px 12px 12px 4px",
                        borderLeft: "5px solid #d902ee",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "40px",
                        color: "#333"
                    }}>
                        ✦
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}