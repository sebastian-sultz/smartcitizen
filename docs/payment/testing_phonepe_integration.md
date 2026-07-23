# Testing PhonePe Payment Integration

To test your payment integration properly before going live, you should use PhonePe's **UAT (Sandbox) Simulator**. This allows you to simulate successful and failed payments without spending real money.

Here is the step-by-step guide to testing the flow locally:

## Step 1: Configure UAT Credentials
Make sure your `backend/.env` file is set up for testing. Go to your PhonePe Business Dashboard, enable **"Test Mode"**, and get your UAT credentials.

```env
PHONEPE_CLIENT_ID=your_uat_client_id
PHONEPE_CLIENT_SECRET=your_uat_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=UAT
```

## Step 2: Expose your Localhost via Ngrok
Since your backend is running on `localhost:8080`, PhonePe's servers **cannot** reach your machine to send the Server-to-Server Webhook. You need to use [Ngrok](https://ngrok.com/) to expose your local server to the internet.

1. Install Ngrok and run:
   ```bash
   ngrok http 8080
   ```
2. Ngrok will give you a public URL (e.g., `https://1a2b-3c4d.ngrok-free.app`).
3. Temporarily update your `backend/.env` file so the Backend generates the webhook and frontend return URLs using this public address:
   ```env
   # Update this so PhonePe redirects you back here after payment
   FRONTEND_URL=https://1a2b-3c4d.ngrok-free.app 
   ```

## Step 3: Initiate a Payment via Postman
Now, act as the Frontend to start a transaction.

1. Open Postman and make a **POST** request to:
   `http://localhost:8080/api/payments/initiate`
2. **Body (Raw JSON):**
   ```json
   {
     "amount": 100, 
     "donorName": "Test User",
     "donorEmail": "test@example.com",
     "donorPhone": "9999999999"
   }
   ```
3. **Response:** You will get a `merchantOrderId` and a `redirectUrl`.

## Step 4: Simulate the Payment
1. Copy the `redirectUrl` from the Postman response and paste it into your browser.
2. Because `PHONEPE_ENV=UAT` is set, PhonePe will show a **Mock Simulator Checkout Page** instead of a real bank page.
3. The simulator will ask you to choose a payment outcome. Click **"Success"**.
4. PhonePe will redirect you back to `FRONTEND_URL/donation/status?transactionId=xyz`.

## Step 5: Verify the Webhook and Database
1. When you clicked "Success" in the simulator, PhonePe simultaneously sent a webhook to your Ngrok URL (`/api/payments/webhook`).
2. **Check your Terminal:** Look at your Go backend logs. You should see a `200 OK` POST request to `/api/payments/webhook`.
3. **Check the Database:** Look at the `payments` table in PostgreSQL. The row for your `merchantOrderId` should now have `status = 'SUCCESS'`.

## Step 6: Verify the Status API
Act as the Frontend checking the final status:
1. Open Postman and make a **GET** request to:
   `http://localhost:8080/api/payments/status/{merchantOrderId}`
2. Ensure the response shows the updated `SUCCESS` status and contains the `providerReferenceId`.

**Done!** If all these steps work, your backend integration is 100% solid and ready for the real frontend UI to be connected!
