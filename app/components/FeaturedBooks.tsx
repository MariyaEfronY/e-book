import BookGrid from "./BookGrid"; // Assuming BookGrid is already in components/

export default function FeaturedBooks() {
    return (
        <section style={{ padding: "100px 5%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "50px", color: "#f162ff" }}>Featured Publications</h2>
            <BookGrid />
        </section>
    );
}