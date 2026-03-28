import AdminSidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#320d3e" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: "40px", color: "white" }}>
                {children}
            </main>
        </div>
    );
}