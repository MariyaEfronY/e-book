"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, FileText, CheckCircle2, AlertCircle,
    IndianRupee, Loader2, ImageIcon, BookOpen, Sparkles
} from "lucide-react";

// Professional Color Palette
const COLORS = {
    primary: "#d902ee", // Electric Purple
    secondary: "#320d3e",
    accent: "#ffd79d", // Peach/Gold
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
    input: "rgba(0, 0, 0, 0.3)",
};

export default function PublishBookPage() {
    const [pdf, setPdf] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const pdfRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);

    // Handle Cover Preview
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCover(file);
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
        } else {
            setCoverPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdf || !title || !description) {
            setStatus({ type: "error", msg: "Please complete all required fields." });
            return;
        }

        const formData = new FormData();
        formData.append("pdf", pdf);
        if (cover) formData.append("coverImage", cover);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("isFree", String(isFree));
        formData.append("price", String(price));

        try {
            setLoading(true);
            setStatus(null);

            // FIXED PATH: Ensure plural 'books'
            const res = await fetch("/api/publish", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Upload failed");

            setStatus({ type: "success", msg: "Book published successfully! Awaiting admin review." });

            // Reset
            setPdf(null); setCover(null); setCoverPreview(null);
            setTitle(""); setDescription(""); setPrice(0); setIsFree(true);

        } catch (err: any) {
            setStatus({ type: "error", msg: err.message || "Network error" });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "14px", borderRadius: "12px",
        backgroundColor: COLORS.input, border: `1px solid ${COLORS.border}`,
        color: "white", outline: "none", fontSize: "14px", marginTop: "8px",
        transition: "all 0.3s ease"
    };

    return (
        <div style={{ minHeight: "100vh", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: "100%", maxWidth: "1000px", background: COLORS.glass,
                    backdropFilter: "blur(12px)", padding: "30px", borderRadius: "32px",
                    border: `1px solid ${COLORS.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                }}
            >
                {/* Header */}
                <header style={{ marginBottom: "30px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "rgba(217, 2, 238, 0.1)", marginBottom: "15px" }}>
                        <BookOpen color={COLORS.primary} size={32} />
                    </div>
                    <h1 style={{ color: COLORS.accent, fontSize: "2rem", fontWeight: "900", margin: 0, letterSpacing: "-0.5px" }}>
                        Author Studio
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "5px" }}>Publish your next masterpiece to the world.</p>
                </header>

                <AnimatePresence>
                    {status && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            style={{
                                overflow: "hidden", display: "flex", alignItems: "center", gap: "10px",
                                padding: "15px", borderRadius: "12px", marginBottom: "20px",
                                background: status.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                border: `1px solid ${status.type === "success" ? "#22c55e" : "#ef4444"}`,
                                color: status.type === "success" ? "#4ade80" : "#f87171"
                            }}>
                            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span style={{ fontSize: "14px", fontWeight: "600" }}>{status.msg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>

                    {/* Column 1: Metadata */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: "800", color: COLORS.primary, textTransform: "uppercase", letterSpacing: "1px" }}>Manuscript Title</label>
                            <input required style={inputStyle} placeholder="Enter book title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div>
                            <label style={{ fontSize: "11px", fontWeight: "800", color: COLORS.primary, textTransform: "uppercase", letterSpacing: "1px" }}>Synopsis</label>
                            <textarea required style={{ ...inputStyle, minHeight: "120px", resize: "none" }} placeholder="Describe your book..." value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "14px", fontWeight: "600" }}>Monetization</span>
                                <button type="button" onClick={() => setIsFree(!isFree)} style={{
                                    padding: "6px 16px", borderRadius: "20px", border: "none",
                                    background: isFree ? "rgba(255,255,255,0.1)" : COLORS.primary,
                                    color: "white", fontSize: "12px", fontWeight: "bold", cursor: "pointer"
                                }}>
                                    {isFree ? "Free Access" : "Paid Content"}
                                </button>
                            </div>

                            {!isFree && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "15px", position: "relative" }}>
                                    <input type="number" style={inputStyle} placeholder="Set Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                                    <IndianRupee size={14} style={{ position: "absolute", right: "12px", top: "22px", opacity: 0.3 }} />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Uploads */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div onClick={() => pdfRef.current?.click()} style={{
                            height: "140px", borderRadius: "20px", border: `2px dashed ${pdf ? COLORS.primary : "rgba(255,255,255,0.1)"}`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", transition: "0.3s", background: pdf ? "rgba(217, 2, 238, 0.05)" : "transparent"
                        }}>
                            <input type="file" ref={pdfRef} hidden accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] || null)} />
                            {pdf ? <><FileText color={COLORS.primary} size={30} /><span style={{ fontSize: "12px", marginTop: "10px" }}>{pdf.name}</span></>
                                : <><Upload size={30} style={{ opacity: 0.2 }} /><span style={{ fontSize: "12px", marginTop: "10px", color: "rgba(255,255,255,0.3)" }}>Upload PDF</span></>}
                        </div>

                        <div onClick={() => coverRef.current?.click()} style={{
                            height: "220px", borderRadius: "20px", border: `2px dashed ${cover ? COLORS.primary : "rgba(255,255,255,0.1)"}`,
                            position: "relative", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                        }}>
                            <input type="file" ref={coverRef} hidden accept="image/*" onChange={handleCoverChange} />
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
                                    <div style={{ position: "absolute", textAlign: "center" }}>
                                        <ImageIcon size={30} color={COLORS.primary} />
                                        <p style={{ fontSize: "12px", fontWeight: "bold" }}>Change Cover</p>
                                    </div>
                                </>
                            ) : (
                                <><ImageIcon size={30} style={{ opacity: 0.2 }} /><span style={{ fontSize: "12px", marginTop: "10px", color: "rgba(255,255,255,0.3)" }}>Upload Cover Image</span></>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            style={{
                                padding: "18px", borderRadius: "16px", border: "none",
                                background: COLORS.primary, color: "white", fontWeight: "800",
                                fontSize: "16px", cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: "0 10px 25px rgba(217, 2, 238, 0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {loading ? "UPLOADING..." : "PUBLISH MANUSCRIPT"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}