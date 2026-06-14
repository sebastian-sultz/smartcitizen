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
	UserID       *string `json:"userId" form:"userId"`
	Search       *string `json:"search" form:"search"`
	Status       *string `json:"status" form:"status"`
	TaxExemption *bool   `json:"taxExemption" form:"taxExemption"`
	StartDate    *string `json:"startDate" form:"startDate"`
	EndDate      *string `json:"endDate" form:"endDate"`
	SortBy       *string `json:"sortBy" form:"sortBy"`
	SortOrder    *string `json:"sortOrder" form:"sortOrder"`
}

type UpdateTaxDetailsRequest struct {
	DonorPAN     string `json:"donorPan" binding:"required"`
	DonorAddress string `json:"donorAddress" binding:"required"`
}
