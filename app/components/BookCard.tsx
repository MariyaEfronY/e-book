// /components/BookCard.tsx

import { useRouter } from "next/navigation";

export default function BookCard({ book }: any) {
    const router = useRouter();

    return (
        <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            transition: "0.3s",
            cursor: "pointer"
        }}>
            <img
                src={book.coverImage || "/placeholder.png"}
                alt={book.title}
                style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px"
                }}
            />

            <h3 style={{
                marginTop: "10px",
                fontSize: "16px",
                fontWeight: "600"
            }}>
                {book.title}
            </h3>

            <p style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "4px"
            }}>
                {book.description}
            </p>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px"
            }}>
                <span style={{
                    fontWeight: "bold",
                    color: "#4F46E5"
                }}>
                    {book.isFree ? "Free" : `₹${book.price}`}
                </span>

                <button
                    onClick={() => router.push(`/books/${book._id}`)}
                    style={{
                        backgroundColor: "#4F46E5",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    View
                </button>
            </div>
        </div>
    );
}