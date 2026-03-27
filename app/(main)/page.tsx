// /app/(main)/page.tsx

"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";

export default function HomePage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("/api/books")
            .then(res => res.json())
            .then(setBooks);
    }, []);

    return (
        <div style={{
            backgroundColor: "#f3f4f6",
            minHeight: "100vh"
        }}>
            <Navbar />

            <div style={{
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px"
            }}>
                {books.map((book: any) => (
                    <BookCard key={book._id} book={book} />
                ))}
            </div>
        </div>
    );
}