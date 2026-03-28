"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    IndianRupee,
    Loader2,
    X
} from "lucide-react";

const COLORS = {
    bg: "#320d3e",
    primary: "#d902ee",
    accent: "#ffd79d",
    glass: "rgba(255, 255, 255, 0.03)",
    border: "rgba(217, 2, 238, 0.2)",
    input: "rgba(0, 0, 0, 0.2)",
};

export default function PublishBook() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isFree: true,
        price: "0",
        coverImage: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setStatus(null);
        } else {
            setStatus({ type: "error", msg: "Please select a valid PDF file" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return setStatus({ type: "error", msg: "PDF Manuscript is required" });

        setLoading(true);
        setStatus(null);

        try {
            const data = new FormData();
            data.append("pdf", file);
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("isFree", String(formData.isFree));
            data.append("price", formData.price);
            data.append("coverImage", formData.coverImage);

            const res = await fetch("/api/books/publish", {
                method: "POST",
                body: data, // Note: No Content-Type header; browser sets it automatically for FormData
            });

            const result = await res.json();

            if (result.success) {
                setStatus({ type: "success", msg: "Published! Sent to Admin for approval." });
                setFormData({ title: "", description: "", isFree: true, price: "0", coverImage: "" });
                setFile(null);
            } else {
                setStatus({ type: "error", msg: result.error || "Something went wrong" });
            }
        } catch (err) {
            setStatus({ type: "error", msg: "Server connection failed" });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "14px", borderRadius: "12px",
        backgroundColor: COLORS.input, border: `1px solid ${COLORS.border}`,
        color: "white", outline: "none", fontSize: "14px", marginTop: "8px",
        transition: "border-color 0.2s"
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <header style={{ marginBottom: "40px" }}>
                <h1 style={{ color: COLORS.accent, fontSize: "2.2rem", fontWeight: "900", margin: 0 }}>
                    Publish New E-Book
                </h1>
                <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
                    Upload your manuscript (PDF) and set your publishing details.
                </p>
            </header>

            {status && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{
                        padding: "16px", borderRadius: "12px", marginBottom: "30px",
                        display: "flex", alignItems: "center", gap: "12px",
                        backgroundColor: status.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        border: `1px solid ${status.type === "success" ? "#22c55e" : "#ef4444"}`,
                        color: status.type === "success" ? "#4ade80" : "#f87171"
                    }}>
                    {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>{status.msg}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px" }}>

                {/* Section 1: Book Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <label style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" }}>Book Title</label>
                        <input required style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. The Art of Web Design" />
                    </div>

                    <div>
                        <label style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" }}>Synopsis / Description</label>
                        <textarea required rows={6} style={inputStyle} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Write a compelling summary..." />
                    </div>

                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" }}>Price Model</label>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                {["Free", "Paid"].map(mode => (
                                    <button key={mode} type="button"
                                        onClick={() => setFormData({ ...formData, isFree: mode === "Free", price: mode === "Free" ? "0" : formData.price })}
                                        style={{
                                            flex: 1, padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer",
                                            backgroundColor: (mode === "Free" ? formData.isFree : !formData.isFree) ? COLORS.primary : COLORS.glass,
                                            color: (mode === "Free" ? formData.isFree : !formData.isFree) ? "white" : "rgba(255,255,255,0.4)",
                                            fontWeight: "bold", transition: "0.2s"
                                        }}>{mode}</button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence>
                            {!formData.isFree && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ flex: 1 }}>
                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" }}>Price (₹)</label>
                                    <div style={{ position: "relative" }}>
                                        <input type="number" style={inputStyle} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                        <IndianRupee size={14} style={{ position: "absolute", right: "12px", top: "22px", opacity: 0.4 }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Section 2: Files & Action */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <label style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" }}>PDF Manuscript</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                marginTop: "10px", height: "200px", borderRadius: "20px",
                                border: `2px dashed ${file ? COLORS.primary : "rgba(255,255,255,0.1)"}`,
                                backgroundColor: file ? "rgba(217, 2, 238, 0.05)" : COLORS.input,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "all 0.3s"
                            }}>
                            <input type="file" ref={fileInputRef} hidden accept=".pdf" onChange={handleFileChange} />
                            {file ? (
                                <>
                                    <FileText size={48} color={COLORS.primary} />
                                    <p style={{ color: "white", marginTop: "12px", fontWeight: "600", fontSize: "14px" }}>{file.name}</p>
                                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: "12px", cursor: "pointer", marginTop: "5px" }}>Remove</button>
                                </>
                            ) : (
                                <>
                                    <Upload size={48} color="rgba(255,255,255,0.2)" />
                                    <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "12px", fontSize: "13px" }}>Drag & drop or click to upload PDF</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.primary, textTransform: "uppercase" }}>Cover Image URL</label>
                        <input style={inputStyle} value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} placeholder="https://..." />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: `0 0 25px ${COLORS.primary}40` }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        style={{
                            marginTop: "auto", padding: "20px", borderRadius: "15px", border: "none",
                            backgroundColor: COLORS.primary, color: "white", fontSize: "16px",
                            fontWeight: "900", cursor: loading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                        }}
                    >
                        {loading ? <><Loader2 className="animate-spin" size={20} /> UPLOADING...</> : "SEND TO ADMIN"}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}