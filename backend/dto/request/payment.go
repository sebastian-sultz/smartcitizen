package request

type InitiatePaymentRequest struct {
	Amount       int64  `json:"amount" binding:"required,gt=0"` // Amount in INR
	DonorName    string `json:"donorName" binding:"required"`
	DonorEmail   string `json:"donorEmail,omitempty"`
	DonorPhone   string `json:"donorPhone,omitempty"`
	DonorPAN     string `json:"donorPan,omitempty"`
	DonorAddress string `json:"donorAddress,omitempty"`
}

type PaymentFilter struct {
	UserID       *string `json:"userId"`
	Search       *string `json:"search"`
	Status       *string `json:"status"`
	TaxExemption *bool   `json:"taxExemption"`
	StartDate    *string `json:"startDate"`
	EndDate      *string `json:"endDate"`
	SortBy       *string `json:"sortBy"`
	SortOrder    *string `json:"sortOrder"`
}

