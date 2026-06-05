# Frontend PhonePe Integration Guide

The backend for the PhonePe integration is fully implemented using the official PhonePe SDK and standard checkout OAuth 2.0 flow. 
The backend exposes the `/api/payments` endpoints. Here is exactly what the frontend needs to do to integrate this payment flow.

## 1. Initiate Payment

When a user submits a donation form, call the `initiate` endpoint.

**Endpoint:** `POST /api/payments/initiate`
**Headers:** `Authorization: Bearer <user_token>` (Optional - only if user is logged in)
**Payload:**
```json
{
  "amount": 500, // Important: Send actual amount in INR. The backend converts it to paise.
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "donorPhone": "9876543210"
}
```

**Response:**
```json
{
  "redirectUrl": "https://mercury-uat.phonepe.com/transact/...",
  "merchantOrderId": "e4b2..."
}
```

**Frontend Action:**
Once you receive the response, immediately redirect the user to the `redirectUrl`:
```javascript
window.location.href = response.data.redirectUrl;
```

---

## 2. Handle the Return/Status Page

After the user completes (or cancels) the payment on PhonePe's gateway, PhonePe will redirect them back to the frontend URL configured in the backend's `.env` (`FRONTEND_URL/donation/status?transactionId=xyz`).

**Frontend Action:**
1. Create a Next.js route at `app/donation/status/page.tsx` (or similar).
2. Extract the `transactionId` query parameter from the URL.
3. Fetch the final status from the backend to verify the transaction.

**Endpoint:** `GET /api/payments/status/:transactionId`

**Response:**
```json
{
  "id": "...",
  "merchantOrderId": "e4b2...",
  "amount": 50000, 
  "status": "SUCCESS", // Will be SUCCESS, FAILED, PENDING, or CANCELLED
  "donorName": "John Doe"
}
```

**Frontend UI:**
- If `status === "SUCCESS"`: Display a "Thank You" message and optionally generate a receipt.
- If `status === "FAILED"`: Display a "Payment Failed" message with a "Try Again" button.
- If `status === "PENDING"`: Display a message like "Payment is being processed. Please check back later."

---

## 3. View Payment History (Optional)

If you want to display the user's donation history, you can use the history API.

**Endpoint:** `GET /api/payments/history?page=1&limit=10`
**Headers:** `Authorization: Bearer <user_token>`

This will return a paginated list of all payments associated with the logged-in user. Admins can view all payments.
