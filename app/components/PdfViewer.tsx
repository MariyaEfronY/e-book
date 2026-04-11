"use client";

import { Document, Page, pdfjs } from "react-pdf";

// ✅ Worker fix (local)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();



export default function PdfViewer({ url, numPages, setNumPages }: any) {
    return (
        <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
            {Array.from(new Array(Math.min(numPages, 5)), (_, i) => (
                <div key={i} style={{ position: "relative", marginBottom: "20px" }}>
                    <Page
                        pageNumber={i + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                    {/* WATERMARK */}
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) rotate(-30deg)",
                            fontSize: "40px",
                            color: "rgba(200,200,200,0.3)",
                            fontWeight: "bold",
                            pointerEvents: "none",
                        }}
                    >
                        PREVIEW ONLY
                    </div>
                </div>
            ))}
        </Document>
    );
}