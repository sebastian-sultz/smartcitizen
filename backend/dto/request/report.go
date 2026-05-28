package request

type CreateReportReq struct {
	ReportedUserID string `json:"reported_user_id" binding:"required"`
	Reason         string `json:"reason" binding:"required"`
}

type ResolveReportReq struct {
	ActionTaken string `json:"action_taken" binding:"required"`
}

type AddMessageReq struct {
	Message string `json:"message" binding:"required"`
}
