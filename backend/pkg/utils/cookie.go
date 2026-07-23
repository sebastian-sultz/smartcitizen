package utils

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func SetAuthCookies(c *gin.Context, accessToken, refreshToken string) {
	isProduction := os.Getenv("GIN_MODE") == "release" || os.Getenv("APP_ENV") == "production"
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("access_token", accessToken, 15*60, "/", "", isProduction, true)
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "", isProduction, true)
}

func ClearAuthCookies(c *gin.Context) {
	isProduction := os.Getenv("GIN_MODE") == "release" || os.Getenv("APP_ENV") == "production"
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("access_token", "", -1, "/", "", isProduction, true)
	c.SetCookie("refresh_token", "", -1, "/", "", isProduction, true)
}
