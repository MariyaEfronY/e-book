export default function Stats() {
    const items = [
        { label: "Active Users", value: "25K+" },
        { label: "Daily Uploads", value: "150+" },
        { label: "Global Reach", value: "120 Countries" }
    ];

    return (
        <section style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", padding: "40px", backgroundColor: "rgba(0,0,0,0.2)" }}>
            {items.map((item, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                    <h2 style={{ color: "#ffd79d", margin: 0 }}>{item.value}</h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textTransform: "uppercase" }}>{item.label}</p>
                </div>
            ))}
        </section>
    );
}