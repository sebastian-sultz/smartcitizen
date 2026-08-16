package utils

import (
	"fmt"
	"time"

	"github.com/johnfercher/maroto/v2"
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/line"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/config"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/consts/orientation"
	"github.com/johnfercher/maroto/v2/pkg/consts/pagesize"
	"github.com/johnfercher/maroto/v2/pkg/core"
	"github.com/johnfercher/maroto/v2/pkg/props"
)

type AdminReportHeaderProps struct {
	Title       string
	Subtitle    string
	TotalCount  int
	GeneratedAt time.Time
}

// BuildLandscapeMaroto creates a configured landscape A4 document builder
func BuildLandscapeMaroto() core.Maroto {
	cfg := config.NewBuilder().
		WithPageSize(pagesize.A4).
		WithOrientation(orientation.Horizontal).
		WithLeftMargin(10).
		WithRightMargin(10).
		WithTopMargin(10).
		WithBottomMargin(10).
		Build()

	return maroto.New(cfg)
}

// BuildPortraitMaroto creates a configured portrait A4 document builder for dossiers
func BuildPortraitMaroto() core.Maroto {
	cfg := config.NewBuilder().
		WithPageSize(pagesize.A4).
		WithOrientation(orientation.Vertical).
		WithLeftMargin(10).
		WithRightMargin(10).
		WithTopMargin(10).
		WithBottomMargin(10).
		Build()

	return maroto.New(cfg)
}

// AddAdminReportHeader adds an official NGO branded header for landscape audit tables
func AddAdminReportHeader(m core.Maroto, h AdminReportHeaderProps) {
	m.AddRows(
		row.New(12).Add(
			col.New(8).Add(
				text.New("GLOBAL SMART CITIZENS FOUNDATION", props.Text{
					Style: fontstyle.Bold,
					Size:  14,
					Color: &props.Color{Red: 15, Green: 23, Blue: 42},
				}),
				text.New("12A Registered | 80G Approved | NGO Darpan Registered | Administrative Audit Report", props.Text{
					Top:   5,
					Size:  8,
					Color: &props.Color{Red: 100, Green: 116, Blue: 139},
				}),
			),
			col.New(4).Add(
				text.New(fmt.Sprintf("Generated: %s", h.GeneratedAt.Format("02 Jan 2006, 15:04:05 IST")), props.Text{
					Size:  8,
					Align: align.Right,
					Color: &props.Color{Red: 100, Green: 116, Blue: 139},
				}),
				text.New(fmt.Sprintf("Total Records: %d", h.TotalCount), props.Text{
					Top:   5,
					Size:  9,
					Style: fontstyle.Bold,
					Align: align.Right,
					Color: &props.Color{Red: 15, Green: 23, Blue: 42},
				}),
			),
		),
		row.New(8).Add(
			col.New(12).Add(
				text.New(h.Title, props.Text{
					Style: fontstyle.Bold,
					Size:  11,
					Color: &props.Color{Red: 30, Green: 41, Blue: 59},
				}),
			),
		),
		row.New(3).Add(
			col.New(12).Add(
				line.New(props.Line{
					Color:     &props.Color{Red: 203, Green: 213, Blue: 225},
					Thickness: 0.5,
				}),
			),
		),
	)
}

type DossierHeaderProps struct {
	DocumentType string
	SubjectName  string
	SubjectID    string
	GeneratedAt  time.Time
}

// AddDossierHeader adds an executive portrait dossier header
func AddDossierHeader(m core.Maroto, h DossierHeaderProps) {
	primaryColor := &props.Color{Red: 15, Green: 23, Blue: 42}
	accentColor := &props.Color{Red: 16, Green: 185, Blue: 129}
	mutedColor := &props.Color{Red: 100, Green: 116, Blue: 139}

	m.AddRows(
		row.New(15).Add(
			col.New(8).Add(
				text.New("GLOBAL SMART CITIZENS FOUNDATION", props.Text{
					Style: fontstyle.Bold,
					Size:  13,
					Color: primaryColor,
				}),
				text.New("Section 8 NGO | 12A & 80G Certified | Darpan: DL/2023/034821", props.Text{
					Top:   5,
					Size:  7.5,
					Color: mutedColor,
				}),
				text.New("Official Verification & Administrative Dossier", props.Text{
					Top:   9,
					Size:  7,
					Style: fontstyle.Italic,
					Color: accentColor,
				}),
			),
			col.New(4).Add(
				text.New("CONFIDENTIAL RECORD", props.Text{
					Style: fontstyle.Bold,
					Size:  8,
					Align: align.Right,
					Color: &props.Color{Red: 225, Green: 29, Blue: 72},
				}),
				text.New(fmt.Sprintf("Issued: %s", h.GeneratedAt.Format("02 Jan 2006, 15:04 IST")), props.Text{
					Top:   4,
					Size:  7,
					Align: align.Right,
					Color: mutedColor,
				}),
				text.New(fmt.Sprintf("Citizen ID: %s", h.SubjectID), props.Text{
					Top:   8,
					Size:  7.5,
					Style: fontstyle.Bold,
					Align: align.Right,
					Color: primaryColor,
				}),
			),
		),
		row.New(6).Add(
			col.New(12).Add(
				text.New(h.DocumentType, props.Text{
					Style: fontstyle.Bold,
					Size:  10,
					Color: primaryColor,
					Top:   1,
				}),
			),
		),
		row.New(2).Add(
			col.New(12).Add(
				line.New(props.Line{
					Color:     &props.Color{Red: 15, Green: 23, Blue: 42},
					Thickness: 0.8,
				}),
			),
		),
	)
}
