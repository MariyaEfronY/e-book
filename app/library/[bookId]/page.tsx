"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReaderPage() {
    const params = useParams();
    const bookId = params.bookId as string;

    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) return;

        const fetchBook = async () => {
            const res = await fetch(`/api/book/read?bookId=${bookId}`, {
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setFileUrl(data.fileUrl);
            } else {
                alert("Access denied");
            }
        };

        fetchBook();
    }, [bookId]);

    if (!fileUrl) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading book...</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen overflow-hidden">
            <iframe
                src={fileUrl}
                className="w-full h-full border-none"
            />
        </div>
    );
}