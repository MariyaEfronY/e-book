import UserSidebar from "./components/Sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#320d3e" }}>
            <UserSidebar />
            <main style={{ flex: 1, padding: "40px", color: "white" }}>
                {children}
            </main>
        </div>
    );
}