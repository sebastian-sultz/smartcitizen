package analytics

type RegistrationGrowth struct {
	Month string `json:"month"` // Format: YYYY-MM
	Count int64  `json:"count"`
}

type DonationGrowth struct {
	Month string  `json:"month"` // Format: YYYY-MM
	Total float64 `json:"total"` // Amount in INR
}

type VolunteerActivity struct {
	Category string `json:"category"`
	Status   string `json:"status"`
	Count    int64  `json:"count"`
}

type ReceiptStats struct {
	SuccessPayments int64 `json:"successPayments"`
	GeneratedCount  int64 `json:"generatedCount"`
	PendingCount    int64 `json:"pendingCount"`
}

type OperationalSummaryResponse struct {
	RegistrationGrowth []RegistrationGrowth `json:"registrationGrowth"`
	DonationGrowth     []DonationGrowth     `json:"donationGrowth"`
	VolunteerActivity  []VolunteerActivity  `json:"volunteerActivity"`
	ReceiptStats       ReceiptStats         `json:"receiptStats"`
}
