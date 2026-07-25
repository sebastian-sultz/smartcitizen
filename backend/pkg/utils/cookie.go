package utils

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func getSameSiteMode() http.SameSite {
	sameSite := strings.ToLower(os.Getenv("COOKIE_SAME_SITE"))
	switch sameSite {
	case "none":
		return http.SameSiteNoneMode
	case "strict":
		return http.SameSiteStrictMode
	default:
		return http.SameSiteLaxMode
	}
}

func SetAuthCookies(c *gin.Context, accessToken, refreshToken string) {
	isProduction := os.Getenv("GIN_MODE") == "release" || os.Getenv("APP_ENV") == "production"
	cookieDomain := os.Getenv("COOKIE_DOMAIN")

	c.SetSameSite(getSameSiteMode())
	c.SetCookie("access_token", accessToken, 15*60, "/", cookieDomain, isProduction, true)
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", cookieDomain, isProduction, true)
}

func ClearAuthCookies(c *gin.Context) {
	isProduction := os.Getenv("GIN_MODE") == "release" || os.Getenv("APP_ENV") == "production"
	cookieDomain := os.Getenv("COOKIE_DOMAIN")

	c.SetSameSite(getSameSiteMode())
	c.SetCookie("access_token", "", -1, "/", cookieDomain, isProduction, true)
	c.SetCookie("refresh_token", "", -1, "/", cookieDomain, isProduction, true)
}

