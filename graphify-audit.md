# Codebase Audit & Identified Issues

Based on the graphify extraction and manual codebase review, several bugs, duplicated logic, and rule violations have been identified.

## 1. Code Duplication & Modularization Violations (Frontend)

**Locations:**
- `frontend/features/citizen/referrals/ShareReferral.tsx`
- `frontend/features/citizen/dashboard/ShareReferralDialog.tsx`

**Issue:**
There is a direct violation of **Frontend Coding Rule 10 (Code & Logic Deduplication)**.
Both of the components duplicate the exact same functions:
- `handleCopyLink()`
- `handleWhatsAppShare()`
- `handleEmailShare()`

**Recommendation:** 
Extract these three functions into a shared utility file (e.g. `frontend/lib/sharing.ts` or as part of a custom hook `useShare()`). This ensures the logic is maintained in a single place.

## 2. Type Safety Violations (Frontend)

**Locations:**
- `frontend/lib/axios.ts` (Line 58: `(originalRequest as any).skipAuthRedirect`)
- `frontend/features/shared/auth/api.ts` (Line 71: `} as any);`)
- `frontend/components/ui/Button.tsx` (Line 97: `ref={ref as any}`)

**Issue:**
This violates **Frontend Coding Rule 9 (Type Safety & Avoiding 'any')**, which specifically states: *"Never use `as any` or `any` type annotations... "*

**Recommendation:**
Refactor these files to correctly type the properties. 
- For Axios, extend the `AxiosRequestConfig` type. 
- For the API payload, define a strict type constraint. 
- For the Button component, use `React.forwardRef` with the correct DOM element typing instead of casting the ref.

## 3. Duplicate Logic & God Functions (Backend)

**Location:** 
- `backend/modules/user/handler.go`

**Issue 1: Repetitive JWT Generation**
The `Register`, `Login`, and `CheckRole` functions all independently duplicate the token generation logic, including the fallback for the JWT secret:
```go
secret := os.Getenv("JWT_SECRET")
if secret == "" {
    secret = "supersecret"
}
accessToken, refreshToken, err := jwt.GenerateTokens(user.ID, string(user.UserType), secret)
```
**Recommendation 1:** 
Extract this into a dedicated `generateAuthCookies(c *gin.Context, userID, userType)` helper to remove boilerplate.

**Issue 2: Profile mapping duplication**
The `GetProfile` and `Me` methods contain exact duplicate logic to fetch a referral name and volunteer status:
```go
var refName *string
if user.ReferralID != nil {
	refUser, err := h.service.GetUser(*user.ReferralID)
	if err == nil && refUser != nil {
		refName = &refUser.Name
	}
}
var vol *response.Volunteer
if user.UserType == Volunteer {
	vol, _ = h.service.GetVolunteerByUserID(user.ID.String())
}
```
**Recommendation 2:**
Move this mapping augmentation into the `mapToResponse` function itself or a dedicated service method like `service.GetAugmentedUser()`.

## 4. Hardcoded Environment Variables & Vulnerabilities (Backend)

**Location:**
- `backend/modules/user/handler.go`

**Issue:**
The application uses `"supersecret"` as a fallback for the `JWT_SECRET`.
This poses a significant security vulnerability if the `JWT_SECRET` environment variable fails to load in production, as all generated tokens would use a publicly known secret.

**Recommendation:**
Fail securely. If `JWT_SECRET` is missing in production, the application should panic or return an internal server error during startup rather than falling back to an insecure key.
