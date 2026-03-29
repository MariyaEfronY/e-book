"use client";
import { useState, useEffect } from "react";
import AutherSidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Sync layout with screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#1a0621", // Deepest purple for background contrast
            overflowX: "hidden"
        }}>
            {/* Sidebar with state control */}
            <AutherSidebar />

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0, // Prevents flex-child overflow
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                // On mobile, padding is 0. On desktop, matches Sidebar width.
                paddingLeft: isMobile ? "0" : (isSidebarOpen ? "280px" : "85px"),
                paddingTop: isMobile ? "60px" : "0", // Space for mobile header toggle
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: isMobile ? "20px" : "40px",
                    minHeight: "100vh",
                }}>
                    {/* Page Content with Entrance Animation Wrapper */}
                    <div style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "24px",
                        border: "1px solid rgba(217, 2, 238, 0.1)",
                        padding: isMobile ? "15px" : "30px",
                        minHeight: "calc(100vh - 80px)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)",
                    }}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}