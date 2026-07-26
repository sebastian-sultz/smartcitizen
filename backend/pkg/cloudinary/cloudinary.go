package cloudinary

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var cld *cloudinary.Cloudinary

// InitCloudinary initializes the Cloudinary instance.
func InitCloudinary() error {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		log.Println("WARNING: Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing in environment!")
	}

	var err error
	cld, err = cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}
	return nil
}

// UploadImage uploads an image to Cloudinary and returns the Secure URL and Public ID.
func UploadImage(ctx context.Context, file interface{}, folder string) (string, string, error) {
	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{Folder: folder})
	if err != nil {
		return "", "", err
	}
	return resp.SecureURL, resp.PublicID, nil
}

// DeleteImage deletes an image from Cloudinary by its Public ID.
func DeleteImage(ctx context.Context, publicID string) error {
	_, err := cld.Upload.Destroy(ctx, uploader.DestroyParams{PublicID: publicID})
	return err
}

// UploadPDF uploads a PDF file (raw bytes) to Cloudinary and returns the Secure URL and Public ID.
func UploadPDF(ctx context.Context, fileBytes []byte, folder string, filename string) (string, string, error) {
	resp, err := cld.Upload.Upload(ctx, bytes.NewReader(fileBytes), uploader.UploadParams{
		Folder:       folder,
		PublicID:     filename,
		ResourceType: "image",
		Type:         "private",
		Invalidate:   api.Bool(true),
	})
	if err != nil {
		return "", "", err
	}
	return resp.SecureURL, resp.PublicID, nil
}

// GetPrivateURL generates a temporary signed URL for a private PDF receipt.
func GetPrivateURL(publicID string) (string, error) {
	return cld.Upload.PrivateDownloadURL(uploader.PrivateDownloadURLParams{
		PublicID:     publicID,
		DeliveryType: "private",
		ResourceType: api.Image,
		Format:       "pdf",
		Attachment:   "true",
	})
}
