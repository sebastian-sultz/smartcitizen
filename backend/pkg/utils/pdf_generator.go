package utils

import (
	"fmt"
	"time"

	"github.com/johnfercher/maroto/v2"
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
)

type ReceiptData struct {
	ReceiptNum    string
	CreatedAt     time.Time
	DonorName     string
	DonorPAN      string
	DonorPhone    string
	DonorAddress  string
	Amount        float64 // in INR
	PaymentMethod string
	TransactionID string
}

func GenerateReceiptPDF(data ReceiptData) ([]byte, error) {
	m := maroto.New()

	// Header
	m.AddRows(
		row.New(20).Add(
			col.New(12).Add(
				text.New("SMART CITIZENS FOUNDATION", props.Text{
					Top:   5,
					Style: fontstyle.Bold,
					Align: align.Center,
					Size:  20,
				}),
			),
		),
		row.New(10).Add(
			col.New(12).Add(
				text.New("(Registered Charitable Organization)", props.Text{
					Align: align.Center,
					Size:  10,
				}),
			),
		),
		row.New(10).Add(
			col.New(12).Add(
				text.New("12A Registered | 80G Approved | NGO Darpan Registered", props.Text{
					Align: align.Center,
					Size:  10,
					Style: fontstyle.Bold,
				}),
			),
		),
		row.New(10).Add(
			col.New(12).Add(
				text.New("139/2, Bhulai Ka Pura, Teliarganj, Prayagraj, Uttar Pradesh, India", props.Text{
					Align: align.Center,
					Size:  10,
				}),
			),
		),
	)

	// Receipt Title
	titleText := "DONATION RECEIPT"
	if data.DonorPAN != "" {
		titleText = "80G TAX EXEMPTION RECEIPT"
	}

	m.AddRows(
		row.New(20).Add(
			col.New(12).Add(
				text.New(titleText, props.Text{
					Top:   5,
					Style: fontstyle.Bold,
					Align: align.Center,
					Size:  16,
				}),
			),
		),
		row.New(10).Add(
			col.New(6).Add(
				text.New(fmt.Sprintf("Receipt No. : %s", data.ReceiptNum), props.Text{
					Size:  10,
					Style: fontstyle.Bold,
				}),
			),
			col.New(6).Add(
				text.New(fmt.Sprintf("Date : %s", data.CreatedAt.Format("02/01/2006")), props.Text{
					Size:  10,
					Style: fontstyle.Bold,
					Align: align.Right,
				}),
			),
		),
	)

	// Donor Information
	panText := "PAN : Not Provided"
	if data.DonorPAN != "" {
		panText = fmt.Sprintf("PAN : %s", data.DonorPAN)
	}

	addressText := "Address : Not Provided"
	if data.DonorAddress != "" {
		addressText = fmt.Sprintf("Address : %s", data.DonorAddress)
	}

	phoneText := "Mobile No. : Not Provided"
	if data.DonorPhone != "" {
		phoneText = fmt.Sprintf("Mobile No. : %s", data.DonorPhone)
	}

	m.AddRows(
		row.New(10).Add(
			col.New(12).Add(
				text.New("DONOR INFORMATION", props.Text{
					Style: fontstyle.Bold,
					Size:  12,
				}),
			),
		),
		row.New(10).Add(
			col.New(6).Add(
				text.New(fmt.Sprintf("Donor Name : %s", data.DonorName), props.Text{Size: 10}),
			),
			col.New(6).Add(
				text.New(panText, props.Text{Size: 10}),
			),
		),
		row.New(10).Add(
			col.New(6).Add(
				text.New(phoneText, props.Text{Size: 10}),
			),
			col.New(6).Add(
				text.New(addressText, props.Text{Size: 10}),
			),
		),
	)

	// Donation Details
	m.AddRows(
		row.New(10).Add(
			col.New(12).Add(
				text.New("DONATION DETAILS", props.Text{
					Style: fontstyle.Bold,
					Size:  12,
				}),
			),
		),
		row.New(10).Add(
			col.New(6).Add(
				text.New(fmt.Sprintf("Amount : Rs. %.2f", data.Amount), props.Text{Size: 10, Style: fontstyle.Bold}),
			),
			col.New(6).Add(
				text.New(fmt.Sprintf("Payment Mode : %s", data.PaymentMethod), props.Text{Size: 10}),
			),
		),
		row.New(10).Add(
			col.New(12).Add(
				text.New(fmt.Sprintf("Transaction ID/UTR : %s", data.TransactionID), props.Text{Size: 10}),
			),
		),
	)

	// Declaration
	var declaration string
	if data.DonorPAN != "" {
		declaration = fmt.Sprintf("DECLARATION\nReceived with thanks a voluntary donation of Rs. %.2f from the above donor towards the charitable and social welfare activities of Smart Citizens Foundation.\nDonations are eligible for deduction u/s 80G(5)(vi) of the Income Tax Act, 1961.\nThis is a system-generated receipt and does not require a physical signature.", data.Amount)
	} else {
		declaration = fmt.Sprintf("DECLARATION\nReceived with thanks a voluntary donation of Rs. %.2f from the above donor towards the charitable and social welfare activities of Smart Citizens Foundation.\nThis is a system-generated receipt and does not require a physical signature.", data.Amount)
	}

	m.AddRows(
		row.New(30).Add(
			col.New(12).Add(
				text.New(declaration, props.Text{
					Top:  5,
					Size: 10,
				}),
			),
		),
	)

	// Signature
	m.AddRows(
		row.New(20).Add(
			col.New(12).Add(
				text.New("Authorized Signatory\nSmart Citizens Foundation", props.Text{
					Align: align.Right,
					Size:  10,
					Style: fontstyle.Bold,
				}),
			),
		),
	)

	document, err := m.Generate()
	if err != nil {
		return nil, err
	}

	return document.GetBytes(), nil
}
