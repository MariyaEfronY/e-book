"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import BookGrid from "../components/BookGrid";
// import Footer from "../components/Footer";

export default function HomePage() {
    return (
        <div style={{
            backgroundColor: "#320d3e", // Based on your palette
            backgroundImage: "radial-gradient(circle at 50% -20%, #d902ee33 0%, #320d3e 80%)",
            minHeight: "100vh",
            color: "white",
            overflowX: "hidden"
        }}>
            <Navbar />

            <main>
                {/* Render each modular component from the components folder */}
                <Hero />
                <Stats />

                {/* Main Content Section */}
                <section style={{ padding: "80px 5% 100px" }}>
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <h2 style={{ fontSize: "32px", color: "#ffd79d", fontWeight: "900" }}>
                            TRENDING PUBLICATIONS
                        </h2>
                        <p style={{ color: "#f162ff", opacity: 0.7, marginTop: "10px" }}>
                            Handpicked digital masterpieces from the Nexus ecosystem
                        </p>
                    </div>
                    <BookGrid />
                </section>
            </main>

            {/* <Footer /> */}
        </div>
    );
}