# Frontend Receipt Integration Guide

This guide outlines the steps required for the frontend application to integrate the new 80G compliant donation receipt system.

## 1. Update Payment Payload

The backend `InitiatePaymentRequest` DTO has been updated to accept donor PAN and Address information. The frontend needs to pass these fields when initiating a payment.

### Updated Type Signature
```typescript
interface InitiatePaymentRequest {
    amount: number;         // Amount in INR
    donorName: string;
    donorEmail?: string;
    donorPhone?: string;
    donorPan?: string;      // NEW: Required for 80G exemption
    donorAddress?: string;  // NEW: Recommended for complete records
}
```

### UI Changes
Update the donation form to include fields for **PAN Number** and **Address**. 
* Consider making PAN optional but add a small tooltip explaining that it's required if they wish to claim 80G tax exemptions.

---

## 2. Implement Receipt Polling on Success Page

The backend generates the PDF receipt *asynchronously* after PhonePe fires a successful webhook. Because this happens in the background to prevent webhook timeouts, the receipt might not be immediately available the exact second the user lands on the success page.

### New API Endpoint
* **Endpoint:** `GET /api/payments/receipt/:transactionId`
* **Response `200 OK` (Generated):** `{ "url": "https://res.cloudinary.com/.../receipt.pdf" }`
* **Response `202 Accepted` (Processing):** `{ "status": "processing" }`
* **Response `404 Not Found` (Error):** `{ "error": "receipt not found or payment incomplete" }`

### Polling Logic
When the user arrives at `/donation/status?transactionId=XXX` and the payment is marked as `SUCCESS`:

1.  Make an API call to `/api/payments/receipt/{transactionId}`.
2.  If the response status is `202 Accepted`, show a loading spinner (e.g., "Generating Receipt...") and `setTimeout` to retry the API call after 2-3 seconds.
3.  If the response status is `200 OK`, stop polling. Extract the `url` from the response body and display a **"Download Receipt"** button.
4.  If it returns `404`, display an error or fallback message indicating the receipt couldn't be generated at this moment.

### Example React Component Logic

```tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const ReceiptDownloader = ({ transactionId }: { transactionId: string }) => {
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const fetchReceipt = async () => {
            try {
                const response = await fetch(`/api/payments/receipt/${transactionId}`);
                
                if (response.status === 200) {
                    const data = await response.json();
                    setReceiptUrl(data.url);
                    setIsGenerating(false);
                } else if (response.status === 202) {
                    // Still processing, poll again in 3 seconds
                    timeoutId = setTimeout(fetchReceipt, 3000);
                } else {
                    setIsGenerating(false);
                }
            } catch (error) {
                setIsGenerating(false);
            }
        };

        fetchReceipt();

        return () => clearTimeout(timeoutId); // Cleanup on unmount
    }, [transactionId]);

    if (isGenerating) {
        return <p>Generating your 80G tax receipt...</p>;
    }

    if (!receiptUrl) {
        return <p>Receipt is currently unavailable.</p>;
    }

    return (
        <Button onClick={() => window.open(receiptUrl, "_blank")}>
            Download Receipt
        </Button>
    );
};
```

## 3. General Frontend Rules Reminders
* Ensure `transactionId` is properly extracted from the URL search params using `useSearchParams()`.
* All new form inputs must use the custom `@/components/ui/Input` components.
* Adhere strictly to the flat store shape pattern if utilizing Zustand for the payment data flow.
