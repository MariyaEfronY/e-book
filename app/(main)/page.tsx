"use client";
import Navbar from "../components/Navbar";
import BookGrid from "../components/BookGrid";

export default function HomePage() {
    return (
        <div style={{
            // Neural Dark Theme (Better than f3f4f6 for your Purple aesthetic)
            backgroundColor: "#0d0211",
            backgroundImage: "radial-gradient(circle at 50% -20%, #35084d 0%, #0d0211 80%)",
            minHeight: "100vh",
            color: "white"
        }}>
            {/* 🛠️ 1. Navigation */}
            <Navbar />


            {/* 📚 3. Main Content (The Published Books) */}
            <div style={{ paddingBottom: "100px" }}>
                <BookGrid />
            </div>

            {/* 🏮 4. Simple Footer */}
            <footer style={{
                textAlign: "center",
                padding: "40px",
                borderTop: "1px solid rgba(217, 2, 238, 0.1)",
                color: "rgba(255,255,255,0.3)",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px"
            }}>
                DESIGNED BY MARIYA EFRON • 2026
            </footer>
        </div>
    );
}