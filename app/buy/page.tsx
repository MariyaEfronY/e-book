import { Suspense } from "react";
import BuyClient from "./BuyClient";

export default function Page() {
    return (
        <Suspense fallback={<p style={{ textAlign: "center", marginTop: 100 }}>Loading checkout...</p>}>
            <BuyClient />
        </Suspense>
    );
}