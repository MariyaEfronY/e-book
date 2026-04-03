"use client";

import { useEffect, useState } from "react";
import {
    Loader2,
    CheckCircle,
    XCircle,
    Trash2,
} from "lucide-react";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/admin/books");
            const data = await res.json();
            if (data.success) setBooks(data.books);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const updateStatus = async (id: string, action: string) => {
        console.log("Updating book with ID:", id);
        let reason = "";
        if (action === "reject") {
            const input = prompt("Enter rejection reason:");
            if (input === null) return; // User clicked 'Cancel', stop execution
            reason = input;
        }

        const res = await fetch(`/api/admin/books/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, rejectionReason: reason }),
        });

        if (res.ok) {
            fetchBooks(); // Refresh list
        } else {
            alert("Failed to update status");
        }
    };
    // 🗑 DELETE
    const deleteBook = async (id: string) => {
        if (!confirm("Delete this book?")) return;

        await fetch(`/api/admin/books/${id}`, {
            method: "DELETE",
        });

        fetchBooks();
    };

    // 🎯 FILTER
    const filteredBooks =
        filter === "all"
            ? books
            : books.filter((b) => b.status === filter);

    const getStatusColor = (status: string) => {
        if (status === "approved") return "bg-green-500/20 text-green-400";
        if (status === "rejected") return "bg-red-500/20 text-red-400";
        return "bg-yellow-500/20 text-yellow-400";
    };

    if (loading)
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );

    return (
        <div className="p-4 mx-auto md:p-8 max-w-7xl">
            {/* HEADER */}
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">
                Admin Dashboard
            </h1>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-2 mb-6">
                {["all", "pending", "approved", "rejected"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === f
                            ? "bg-purple-600 text-white"
                            : "bg-white/10 text-white"
                            }`}
                    >
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-sm text-left border-b border-white/10">
                            <th className="p-3">Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBooks.map((book) => (
                            <tr
                                key={book._id}
                                className="text-sm border-b border-white/5"
                            >
                                <td className="p-3 font-semibold">{book.title}</td>
                                <td>{book.authorId?.name}</td>
                                <td>{book.isbn}</td>

                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                            book.status
                                        )}`}
                                    >
                                        {book.status}
                                    </span>
                                </td>

                                <td className="flex gap-2 py-2">
                                    <button
                                        onClick={() =>
                                            updateStatus(book._id, "approve")
                                        }
                                        className="p-2 bg-green-500 rounded"
                                    >
                                        <CheckCircle size={16} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(book._id, "reject")
                                        }
                                        className="p-2 bg-red-500 rounded"
                                    >
                                        <XCircle size={16} />
                                    </button>

                                    <button
                                        onClick={() => deleteBook(book._id)}
                                        className="p-2 bg-gray-700 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid gap-4 md:hidden">
                {filteredBooks.map((book) => (
                    <div
                        key={book._id}
                        className="p-4 border rounded-xl bg-white/5 border-white/10"
                    >
                        <h2 className="text-lg font-bold">{book.title}</h2>
                        <p className="text-sm text-gray-400">
                            {book.authorId?.name}
                        </p>

                        <p className="mt-2 text-xs">ISBN: {book.isbn}</p>

                        <span
                            className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(
                                book.status
                            )}`}
                        >
                            {book.status}
                        </span>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() =>
                                    updateStatus(book._id, "approve")
                                }
                                className="flex-1 py-2 bg-green-500 rounded"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() =>
                                    updateStatus(book._id, "reject")
                                }
                                className="flex-1 py-2 bg-red-500 rounded"
                            >
                                Reject
                            </button>
                        </div>

                        <button
                            onClick={() => deleteBook(book._id)}
                            className="w-full py-2 mt-2 bg-gray-700 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}