"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminBookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState<any>(null);

    useEffect(() => {
        const fetchBook = async () => {
            const res = await fetch(`/api/admin/books`);
            const data = await res.json();
            const found = data.books.find((b: any) => b._id === id);
            setBook(found);
        };

        fetchBook();
    }, [id]);

    if (!book) return <div className="p-10">Loading...</div>;

    return (
        <div className="max-w-4xl p-6 mx-auto">
            <h1 className="mb-4 text-2xl font-bold">{book.title}</h1>

            <img
                src={book.coverImage}
                className="mb-4 rounded w-60"
            />

            <p className="mb-2">Author: {book.authorId?.name}</p>
            <p className="mb-2">ISBN: {book.isbn}</p>
            <p className="mb-2">Status: {book.status}</p>

            <div className="flex gap-4 mt-4">
                <a
                    href={book.fileUrl}
                    target="_blank"
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                >
                    View Full PDF
                </a>

                {book.reviewFileUrl && (
                    <a
                        href={book.reviewFileUrl}
                        target="_blank"
                        className="px-4 py-2 text-white bg-purple-500 rounded"
                    >
                        Preview PDF
                    </a>
                )}
            </div>
        </div>
    );
}