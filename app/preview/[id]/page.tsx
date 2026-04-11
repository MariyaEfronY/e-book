"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// 🔥 IMPORTANT: disable SSR
const PdfViewer = dynamic(() => import("../../components/PdfViewer"), {
    ssr: false,
});

export default function PreviewPage() {
    const params = useParams();
    const [pdfUrl, setPdfUrl] = useState("");
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {
        const fetchBook = async () => {
            const res = await fetch("/api/public-users");
            const data = await res.json();

            const book = data.books.find((b: any) => b.id === params.id);

            if (book) setPdfUrl(book.previewUrl);
        };

        fetchBook();
    }, [params.id]);

    return (
        <div style={{ padding: "20px" }}>
            {pdfUrl && (
                <PdfViewer
                    url={pdfUrl}
                    numPages={numPages}
                    setNumPages={setNumPages}
                />
            )}
        </div>
    );
}