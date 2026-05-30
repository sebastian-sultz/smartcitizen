package request

type CreateReportReq struct {
	Reason         string `json:"reason" binding:"required"`
}

type ResolveReportReq struct {
	ActionTaken string `json:"action_taken" binding:"required"`
}

type AddMessageReq struct {
	Message string `json:"message" binding:"required"`
}
