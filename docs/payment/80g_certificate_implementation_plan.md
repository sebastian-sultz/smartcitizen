# 80G Certificate Implementation Plan

To provide 80G tax exemption certificates to your donors, we need to implement a secure, scalable PDF generation system. This document outlines the technical approach, the document requirements, and the step-by-step implementation plan.

## 1. Generation Strategy & Format
* **Format:** The certificate **must** be exported as a **PDF**. PDFs are immutable, print-friendly, and the standard for legal/tax documents.
* **When to Generate:** We will generate the PDF **On-the-Fly** (dynamically). 
  * *Why?* Instead of generating a file and taking up Cloudinary/S3 storage for every single transaction, we will generate the PDF in milliseconds only when the user requests it. 

## 2. Frontend User Experience
* **Payment Success Page:** Immediately after a successful payment, display a "Download 80G Receipt" button alongside the "Thank You" message.
* **Donation History Dashboard:** In the user's profile, show a table of all past successful donations. Include a download icon (⬇️) next to each `SUCCESS` row.
* **Action:** Clicking the button will call our backend API, which streams the PDF back to the browser, prompting an automatic file download.

## 3. Mandatory Details on an 80G Certificate
To be legally valid for Indian Income Tax deductions, the PDF must contain the following information:

**NGO Information (Hardcoded/Configured in Backend):**
1. Name of the Trust/NGO (e.g., Global Smart Citizens Foundation).
2. Registered Address of the NGO.
3. NGO's PAN Number.
4. **80G Registration Number** and Date of Validity.

**Donor Information:**
1. Name of the Donor.
2. **PAN of the Donor** *(Crucial: Without the donor's PAN, they cannot claim the tax deduction!)*.
3. Address/Email of the Donor.

**Transaction Information:**
1. Receipt Number (We will use the `MerchantOrderID` or database `ID`).
2. Date and Time of Donation.
3. Amount Donated (in numbers and **words**).
4. Mode of Payment (e.g., "Online Payment via PhonePe").
5. A legal declaration: *"Donations are eligible for deduction u/s 80G(5)(vi) of the Income Tax Act, 1961."*
6. An authorized signatory image (a scan of a signature placed at the bottom right).

---

## 4. Backend Implementation Steps

### Step 1: Update the Payment Model
We need to capture the donor's PAN. We must add `DonorPAN` and `DonorAddress` to:
1. `backend/modules/payment/model.go`
2. `backend/dto/request/payment.go` (so the frontend can send it during `/initiate`).

### Step 2: Choose a Go PDF Library
We will use a pure Go PDF library to build the receipt layout.
* **Library:** `github.com/johnfercher/maroto` (Excellent for grid-based layouts like invoices/receipts) or `github.com/jung-kurt/gofpdf`.

### Step 3: Create the PDF Generation Service
Create a new function in `service.go`: `Generate80GCertificate(paymentID string) ([]byte, error)`.
This function will:
1. Fetch the payment details from the DB.
2. Check if the status is `SUCCESS` (deny generation if pending/failed).
3. Draw the NGO logo, headers, dynamic donor data, and the signature image onto a PDF canvas.
4. Return the raw PDF bytes.

### Step 4: Create the Download API Endpoint
* **Route:** `GET /api/payments/certificate/:transactionId`
* **Handler Logic:** 
  It will call the generation service and return the bytes with specific HTTP headers to force a download:
  ```go
  c.Header("Content-Disposition", `attachment; filename="80G_Receipt_`+orderID+`.pdf"`)
  c.Data(http.StatusOK, "application/pdf", pdfBytes)
  ```

---

## 5. Frontend Implementation Steps
1. Add "PAN Number" and "Address" fields to the Donation Form.
2. When the user clicks the download button, the frontend makes a `fetch` request:
```javascript
const response = await fetch(`/api/payments/certificate/${transactionId}`);
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `80G_Receipt_${transactionId}.pdf`;
a.click();
```

### Next Steps
If you approve of this plan, I can immediately start by updating the `Payment` model to include the `DonorPAN` and setting up the Go PDF library in the backend!
