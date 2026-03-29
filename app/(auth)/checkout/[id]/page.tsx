"use client";

import { useState, useEffect, use } from "react"; // 👈 Added 'use'
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

// Define the type for the props
interface CheckoutProps {
    params: Promise<{ id: string }>;
}

export default function CheckoutPage({ params }: CheckoutProps) {
    // 🎯 In Next.js 15/16, we unwrap the params promise using 'use'
    const { id } = use(params);

    const router = useRouter();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [transactionId, setTransactionId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`/api/public-users/${id}`);
                const data = await res.json();
                if (data.success) setBook(data.book);
            } catch (err) {
                console.error("Failed to load book", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`/api/public-users/${id}`);

                // 🛡️ Check if the response is actually JSON
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.error("❌ Server returned HTML/Text instead of JSON. Check your API route path.");
                    return;
                }

                const data = await res.json();
                if (data.success) setBook(data.book);
                else console.error(data.error);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionId) return alert("Please enter Transaction ID");

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/purchase/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookId: id,
                    amount: book?.price,
                    transactionId: transactionId
                })
            });

            const data = await res.json();
            if (data.success) setIsSuccess(true);
            else alert(data.error || "Request failed");
        } catch (err) {
            alert("Network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#13041a" }}>
            <Loader2 className="animate-spin" color="#d902ee" size={40} />
        </div>
    );

    return (
        <main style={{ minHeight: "100vh", background: "#13041a", color: "white", padding: "60px 20px" }}>
            <div style={{
                maxWidth: "450px", margin: "0 auto", background: "rgba(255,255,255,0.03)",
                padding: "30px", borderRadius: "24px", border: "1px solid rgba(217, 2, 238, 0.2)"
            }}>
                {!isSuccess ? (
                    <form onSubmit={handleSubmitRequest}>
                        <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#ffd79d" }}>Payment Verification</h2>
                        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>Order: {book?.title}</p>

                        <div style={{ textAlign: "center", padding: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "15px", marginBottom: "25px" }}>
                            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Amount to Pay</span>
                            <h1 style={{ fontSize: "36px", fontWeight: "900", margin: "0", color: "#d902ee" }}>₹{book?.price}</h1>
                        </div>

                        <div style={{ fontSize: "12px", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>
                            <p style={{ margin: "0 0 5px 0" }}>💳 <strong>UPI/Bank Transfer:</strong> mariyaefron@upi</p>
                            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)" }}>Pay the exact amount and enter the Transaction ID below.</p>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontSize: "13px", marginBottom: "8px", fontWeight: "600" }}>Transaction ID / Ref No.</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter 12-digit Ref No."
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                style={{
                                    width: "100%", padding: "14px", borderRadius: "12px", background: "#000",
                                    border: "1px solid rgba(217, 2, 238, 0.3)", color: "white", outline: "none"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: "100%", padding: "16px", background: "#d902ee", color: "white",
                                border: "none", borderRadius: "12px", fontWeight: "900", cursor: "pointer",
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "SUBMIT FOR VERIFICATION"}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <CheckCircle size={60} color="#ffd79d" style={{ marginBottom: "20px" }} />
                        <h3>Request Submitted!</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Admin will verify your payment. Once approved, the book will be available.</p>
                        <button onClick={() => router.push("/")} style={{ marginTop: "20px", width: "100%", background: "white", padding: "12px", borderRadius: "12px", border: "none", fontWeight: "800" }}>CONTINUE SHOPPING</button>
                    </div>
                )}
            </div>
        </main>
    );
}