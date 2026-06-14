import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics import renderPDF

def draw_real_qr(canv, x, y, data_url, size=60):
    d = Drawing(size, size)
    qr = QrCodeWidget(data_url)
    qr.barWidth = size
    qr.barHeight = size
    d.add(qr)
    renderPDF.draw(d, canv, x, y)

def generate_pdf_certificate(filename: str, student_name: str, course_name: str, cert_uuid: str, issue_date: str) -> None:
    # Use landscape Letter size: 792 x 612
    width, height = landscape(letter)
    canv = canvas.Canvas(filename, pagesize=(width, height))
    
    # --- Background ---
    # Fill with a subtle premium background color
    canv.setFillColor(colors.HexColor("#f8fafc"))
    canv.rect(0, 0, width, height, fill=1, stroke=0)
    
    # --- Double Border ---
    # Outer Border (Deep Slate/Indigo)
    canv.setStrokeColor(colors.HexColor("#4f46e5")) # Indigo
    canv.setLineWidth(6)
    canv.rect(20, 20, width - 40, height - 40, stroke=1, fill=0)
    
    # Inner Border (Thin Gold)
    canv.setStrokeColor(colors.HexColor("#eab308")) # Amber/Gold
    canv.setLineWidth(2)
    canv.rect(28, 28, width - 56, height - 56, stroke=1, fill=0)
    
    # --- Corner Designs ---
    canv.setFillColor(colors.HexColor("#4f46e5"))
    # Top Left
    canv.rect(20, height - 50, 30, 30, stroke=0, fill=1)
    # Top Right
    canv.rect(width - 50, height - 50, 30, 30, stroke=0, fill=1)
    # Bottom Left
    canv.rect(20, 20, 30, 30, stroke=0, fill=1)
    # Bottom Right
    canv.rect(width - 50, 20, 30, 30, stroke=0, fill=1)
    
    # --- Certificate Content ---
    # Brand/Header
    canv.setFont("Helvetica-Bold", 18)
    canv.setFillColor(colors.HexColor("#1e1b4b")) # Deep Navy
    canv.drawCentredString(width / 2.0, height - 90, "E D U V E R S E")
    
    # Main Header
    canv.setFont("Helvetica-Bold", 36)
    canv.setFillColor(colors.HexColor("#111827")) # Slate-900
    canv.drawCentredString(width / 2.0, height - 160, "CERTIFICATE OF COMPLETION")
    
    # Subtitle text
    canv.setFont("Helvetica", 14)
    canv.setFillColor(colors.HexColor("#4b5563")) # Gray-600
    canv.drawCentredString(width / 2.0, height - 200, "This is proudly presented to")
    
    # Student Name
    canv.setFont("Helvetica-Bold", 28)
    canv.setFillColor(colors.HexColor("#4f46e5")) # Indigo-600
    canv.drawCentredString(width / 2.0, height - 260, student_name)
    
    # Underline under Name
    canv.setStrokeColor(colors.HexColor("#e2e8f0"))
    canv.setLineWidth(1)
    canv.line(width / 2.0 - 150, height - 275, width / 2.0 + 150, height - 275)
    
    # Course explanation
    canv.setFont("Helvetica", 14)
    canv.setFillColor(colors.HexColor("#4b5563"))
    canv.drawCentredString(width / 2.0, height - 310, "for successfully completing the course")
    
    # Course Name
    canv.setFont("Helvetica-Bold", 22)
    canv.setFillColor(colors.HexColor("#0f172a")) # Slate-900
    canv.drawCentredString(width / 2.0, height - 355, course_name)
    
    # --- Footer Details (Dates, QR Code, Signature) ---
    # Issue Date (Left)
    canv.setFont("Helvetica", 10)
    canv.setFillColor(colors.HexColor("#6b7280"))
    canv.drawString(60, 110, f"ISSUE DATE: {issue_date}")
    canv.drawString(60, 95, f"CERTIFICATE ID: {cert_uuid}")
    
    # CEO Signature (Right)
    canv.setFont("Helvetica-Bold", 12)
    canv.setFillColor(colors.HexColor("#1f2937"))
    canv.drawString(width - 240, 140, "Beshoy Simon")
    canv.setFont("Courier-Oblique", 14)
    canv.setFillColor(colors.HexColor("#4f46e5"))
    canv.drawString(width - 245, 160, "Beshoy Simon") # Mock signature script font look
    canv.setStrokeColor(colors.HexColor("#94a3b8"))
    canv.setLineWidth(1)
    canv.line(width - 250, 130, width - 70, 130) # line above subtitle
    canv.setFont("Helvetica", 10)
    canv.setFillColor(colors.HexColor("#6b7280"))
    canv.drawString(width - 200, 115, "CEO, EduVerse")
    
    # Verification block & QR code (Center Bottom)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    verification_url = f"{FRONTEND_URL}/certificates/{cert_uuid}"
    draw_real_qr(canv, width / 2.0 - 30, 85, verification_url, size=60)
    
    canv.setFont("Helvetica-Bold", 8)
    canv.setFillColor(colors.HexColor("#6b7280"))
    canv.drawCentredString(width / 2.0, 70, "SECURE VERIFIED CERTIFICATE")
    canv.setFont("Helvetica", 7)
    canv.drawCentredString(width / 2.0, 60, "Scan code to verify authenticity")
    
    # Save the canvas
    canv.showPage()
    canv.save()

if __name__ == "__main__":
    # Test certificate generation
    generate_pdf_certificate("test.pdf", "John Doe", "Introduction to Python Basics", "123-abc-456", "2026-06-01")
    print("Test certificate generated.")
