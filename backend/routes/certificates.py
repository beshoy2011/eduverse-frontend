import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/certificates", tags=["certificates"])

@router.get("/user", response_model=list[schemas.CertificateOut])
def get_user_certificates(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == current_user.id).all()
    
    # Map models to schema manually since course_title is nested
    out = []
    for c in certs:
        course = db.query(models.Course).filter(models.Course.id == c.course_id).first()
        course_title = course.title if course else "Unknown Course"
        out.append(
            schemas.CertificateOut(
                id=c.id,
                uuid=c.uuid,
                issue_date=c.issue_date,
                recipient_name=c.recipient_name,
                course_title=course_title
            )
        )
    return out

@router.get("/uuid/{cert_uuid}", response_model=schemas.CertificateOut)
def get_certificate_by_uuid(cert_uuid: str, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter(models.Certificate.uuid == cert_uuid).first()
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
        
    course = db.query(models.Course).filter(models.Course.id == cert.course_id).first()
    course_title = course.title if course else "Unknown Course"
    
    return schemas.CertificateOut(
        id=cert.id,
        uuid=cert.uuid,
        issue_date=cert.issue_date,
        recipient_name=cert.recipient_name,
        course_title=course_title
    )

@router.get("/download/{cert_uuid}")
def download_certificate(cert_uuid: str, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter(models.Certificate.uuid == cert_uuid).first()
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
        
    # Check if the PDF file exists on disk
    cert_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "certificates")
    pdf_path = os.path.join(cert_dir, f"{cert_uuid}.pdf")
    
    if not os.path.exists(pdf_path):
        # Generate the PDF file on demand if missing
        os.makedirs(cert_dir, exist_ok=True)
        course = db.query(models.Course).filter(models.Course.id == cert.course_id).first()
        course_title = course.title if course else "EduVerse Programming Course"
        date_str = cert.issue_date.strftime("%Y-%m-%d")
        
        from certificate_generator import generate_pdf_certificate
        generate_pdf_certificate(
            filename=pdf_path,
            student_name=cert.recipient_name,
            course_name=course_title,
            cert_uuid=cert.uuid,
            issue_date=date_str
        )
        
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"EduVerse_Certificate_{cert_uuid[:8]}.pdf"
    )
