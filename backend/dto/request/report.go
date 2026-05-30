package request

type CreateReportReq struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type ResolveReportReq struct {
	ActionTaken string `json:"action_taken" binding:"required"`
}

type AddMessageReq struct {
	Message string `json:"message" binding:"required"`
}
