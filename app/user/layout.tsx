import UserSidebar from "./components/Sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#0d0214]">
            <UserSidebar />
            <main className="flex-1 p-6 pt-24 overflow-x-hidden md:p-12 md:pt-12">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}