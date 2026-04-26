"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function BuyClient() {
    const params = useSearchParams();
    const router = useRouter();

    const bookId = params.get("bookId");

    useEffect(() => {
        if (!bookId) {
            router.push("/");
            return;
        }

        const startPayment = async () => {
            try {
                const res = await fetch("/api/payment/create-order", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bookId }),
                });

                const order = await res.json();

                if (!order.id) {
                    alert(order.message || "Order failed");
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                    amount: order.amount,
                    currency: "INR",
                    order_id: order.id,

                    handler: async (response: any) => {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(response),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            router.push(`/library/${bookId}`);
                        } else {
                            alert("Payment verification failed");
                        }
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } catch (err) {
                console.error(err);
                alert("Payment failed");
            }
        };

        startPayment();
    }, [bookId, router]);

    return (
        <p style={{ textAlign: "center", marginTop: "100px" }}>
            Preparing secure checkout...
        </p>
    );
}