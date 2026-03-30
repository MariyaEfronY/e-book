export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{
                margin: 0,
                padding: 0,
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f3f4f6"
            }}>
                {children}
            </body>
        </html>
    );
}