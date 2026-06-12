package request

type InitiatePaymentRequest struct {
	Amount       int64  `json:"amount" binding:"required,gt=0"` // Amount in INR
	DonorName    string `json:"donorName" binding:"required"`
	DonorEmail   string `json:"donorEmail,omitempty"`
	DonorPhone   string `json:"donorPhone,omitempty"`
	DonorPAN     string `json:"donorPan,omitempty"`
	DonorAddress string `json:"donorAddress,omitempty"`
}
