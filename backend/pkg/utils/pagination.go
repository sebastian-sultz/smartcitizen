package utils

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Pagination struct {
	Limit      int   `json:"limit"`
	Page       int   `json:"page"`
	Offset     int   `json:"-"`
	TotalRows  int64 `json:"total_rows"`
	TotalPages int   `json:"total_pages"`
}

func GetPaginationFromContext(c *gin.Context) Pagination {
	limit := 10
	page := 1

	if l, err := strconv.Atoi(c.Query("limit")); err == nil && l > 0 {
		limit = l
	}

	if p, err := strconv.Atoi(c.Query("page")); err == nil && p > 0 {
		page = p
	}

	return Pagination{
		Limit: limit,
		Page:  page,
	}
}

func (p *Pagination) Calculate() {
	if p.Limit == 0 {
		p.Limit = 10
	}
	if p.Page == 0 {
		p.Page = 1
	}
	p.Offset = (p.Page - 1) * p.Limit
	p.TotalPages = int(math.Ceil(float64(p.TotalRows) / float64(p.Limit)))
}
