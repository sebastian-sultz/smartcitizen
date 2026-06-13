package cloudinary

import (
	"context"
	"testing"

	"github.com/joho/godotenv"
)

func TestCloudinaryIntegration(t *testing.T) {
	// Load environment variables from backend/.env
	err := godotenv.Load("../../.env")
	if err != nil {
		t.Logf("Warning: .env file not found: %v. Relying on environment variables.", err)
	}

	// Initialize Cloudinary
	err = InitCloudinary()
	if err != nil {
		t.Fatalf("InitCloudinary failed: %v", err)
	}

	t.Run("Upload and Delete Image", func(t *testing.T) {
		// A tiny 1x1 transparent PNG in base64 as data URI
		dummyImage := "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
		
		secureURL, publicID, err := UploadImage(context.Background(), dummyImage, "test_folder")
		if err != nil {
			t.Fatalf("UploadImage failed: %v", err)
		}
		if secureURL == "" || publicID == "" {
			t.Fatalf("UploadImage returned empty values: url=%q, public_id=%q", secureURL, publicID)
		}
		t.Logf("Successfully uploaded test image.")
		t.Logf("URL: %s", secureURL)
		t.Logf("PublicID: %s", publicID)

		// Delete the image
		err = DeleteImage(context.Background(), publicID)
		if err != nil {
			t.Fatalf("DeleteImage failed: %v", err)
		}
		t.Log("Successfully deleted test image from Cloudinary.")
	})

	t.Run("Upload PDF raw bytes as image", func(t *testing.T) {
		dummyPDFBytes := []byte("%PDF-1.4\n%âãÏÓ\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources << >>\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000015 00000 n \n0000000074 00000 n \n0000000133 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n231\n%%EOF")
		
		secureURL, publicID, err := UploadPDF(context.Background(), dummyPDFBytes, "test_folder", "dummy_test_receipt")
		if err != nil {
			t.Fatalf("UploadPDF failed: %v", err)
		}
		if secureURL == "" || publicID == "" {
			t.Fatalf("UploadPDF returned empty values: url=%q, public_id=%q", secureURL, publicID)
		}
		t.Logf("Successfully uploaded test PDF.")
		t.Logf("URL: %s", secureURL)
		t.Logf("PublicID: %s", publicID)

		// Generate signed URL
		signedURL, err := GetPrivateURL(publicID)
		if err != nil {
			t.Fatalf("GetPrivateURL failed: %v", err)
		}
		t.Logf("Signed Private Download URL: %s", signedURL)

		// Delete the PDF (since it is uploaded as ResourceType: image, DeleteImage works on it!)
		err = DeleteImage(context.Background(), publicID)
		if err != nil {
			t.Fatalf("DeleteImage failed: %v", err)
		}
		t.Log("Successfully deleted test PDF from Cloudinary.")
	})
}
