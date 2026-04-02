"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, FileText, CheckCircle2, AlertCircle,
    IndianRupee, Loader2, ImageIcon, BookOpen, Sparkles
} from "lucide-react";

const COLORS = {
    primary: "#d902ee",
    accent: "#ffd79d",
    border: "rgba(217, 2, 238, 0.2)",
    input: "rgba(0, 0, 0, 0.3)",
};

export default function PublishBookPage() {
    const [pdf, setPdf] = useState<File | null>(null);
    const [reviewPdf, setReviewPdf] = useState<File | null>(null); // ✅ NEW
    const [cover, setCover] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isbn, setIsbn] = useState(""); // ✅ NEW

    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState(0);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);

    const pdfRef = useRef<HTMLInputElement>(null);
    const reviewRef = useRef<HTMLInputElement>(null); // ✅ NEW
    const coverRef = useRef<HTMLInputElement>(null);

    const inputStyle = {
        width: "100%", padding: "14px", borderRadius: "12px",
        backgroundColor: COLORS.input,
        border: `1px solid ${COLORS.border}`,
        color: "white",
        marginTop: "8px"
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pdf || !title || !description || !isbn) {
            setStatus({ type: "error", msg: "Fill all required fields" });
            return;
        }

        const formData = new FormData();
        formData.append("pdf", pdf);
        if (reviewPdf) formData.append("reviewFile", reviewPdf); // ✅ NEW
        if (cover) formData.append("coverImage", cover);

        formData.append("title", title);
        formData.append("description", description);
        formData.append("isbn", isbn); // ✅ NEW
        formData.append("isFree", String(isFree));
        formData.append("price", String(price));

        try {
            setLoading(true);
            setStatus(null);

            const res = await fetch("/api/publish", { // ✅ FIXED
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setStatus({ type: "success", msg: "Book uploaded successfully!" });

            // Reset
            setPdf(null);
            setReviewPdf(null);
            setCover(null);
            setCoverPreview(null);
            setTitle("");
            setDescription("");
            setIsbn("");
            setPrice(0);
            setIsFree(true);

        } catch (err: any) {
            setStatus({ type: "error", msg: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-5xl p-8 border bg-black/40 backdrop-blur-xl rounded-3xl border-purple-500/20">

                {/* HEADER */}
                <div className="mb-6 text-center">
                    <BookOpen className="mx-auto mb-3 text-purple-500" size={32} />
                    <h1 className="text-2xl font-bold text-[#ffd79d]">Author Studio</h1>
                </div>

                {/* STATUS */}
                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className={`p-3 rounded-xl mb-4 flex items-center gap-2 ${status.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                                }`}
                        >
                            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.msg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">

                    {/* LEFT */}
                    <div className="flex flex-col gap-4">

                        <input
                            style={inputStyle}
                            placeholder="Book Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            style={inputStyle}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* ISBN */}
                        <input
                            style={inputStyle}
                            placeholder="ISBN Number"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                        />

                        {/* PRICE */}
                        {!isFree && (
                            <input
                                type="number"
                                style={inputStyle}
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        )}

                        <button
                            type="button"
                            onClick={() => setIsFree(!isFree)}
                            className="text-sm text-purple-400"
                        >
                            {isFree ? "Switch to Paid" : "Switch to Free"}
                        </button>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-4">

                        {/* MAIN PDF */}
                        <div onClick={() => pdfRef.current?.click()} className="upload-box">
                            <input type="file" hidden ref={pdfRef} onChange={(e) => setPdf(e.target.files?.[0] || null)} />
                            {pdf ? pdf.name : "Upload Full PDF"}
                        </div>

                        {/* REVIEW PDF */}
                        <div onClick={() => reviewRef.current?.click()} className="upload-box">
                            <input type="file" hidden ref={reviewRef} onChange={(e) => setReviewPdf(e.target.files?.[0] || null)} />
                            {reviewPdf ? reviewPdf.name : "Upload Preview PDF (Optional)"}
                        </div>

                        {/* COVER */}
                        <div onClick={() => coverRef.current?.click()} className="upload-box">
                            <input type="file" hidden ref={coverRef} onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setCover(file);
                                if (file) setCoverPreview(URL.createObjectURL(file));
                            }} />
                            {coverPreview ? "Cover Selected" : "Upload Cover Image"}
                        </div>

                        {/* BUTTON */}
                        <button
                            disabled={loading}
                            className="flex items-center justify-center gap-2 p-4 font-bold bg-purple-600 rounded-xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            {loading ? "Uploading..." : "Publish Book"}
                        </button>
                    </div>
                </form>

                {/* SMALL STYLE */}
                <style jsx>{`
          .upload-box {
            border: 2px dashed rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
          }
        `}</style>
            </div>
        </div>
    );
}