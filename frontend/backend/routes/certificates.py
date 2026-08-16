import os
import secrets
import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/certificates", tags=["certificates"])

def generate_unique_cert_id(db: Session, prefix="EV-RA-2026"):
    """Generate cryptographically secure non-sequential Certificate ID."""
    for _ in range(20):
        rand_suffix = secrets.token_hex(4).upper()
        candidate = f"{prefix}-{rand_suffix}"
        exists = db.query(models.Certificate).filter(models.Certificate.certificate_id == candidate).first()
        if not exists:
            return candidate
    return f"{prefix}-{secrets.token_hex(6).upper()}"

def generate_verification_token(db: Session):
    """Generate 64-character SHA-style secure verification token."""
    for _ in range(20):
        candidate = secrets.token_hex(32)
        exists = db.query(models.Certificate).filter(models.Certificate.verification_token == candidate).first()
        if not exists:
            return candidate
    return secrets.token_hex(32)


@router.get("/verify/{identifier}", response_model=schemas.CertificateVerificationResponse)
def verify_certificate(identifier: str, db: Session = Depends(get_db)):
    """
    Public Endpoint: Verify any certificate by Certificate ID, Verification Token, or UUID.
    """
    clean_id = identifier.strip()
    
    # Query database by certificate_id, verification_token, or uuid
    cert = db.query(models.Certificate).filter(
        (models.Certificate.certificate_id == clean_id) |
        (models.Certificate.verification_token == clean_id) |
        (models.Certificate.uuid == clean_id)
    ).first()

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{clean_id}' not found in the official EduVerse database registry."
        )

    # Derive course name
    course_name = cert.course_title
    if not course_name:
        course = db.query(models.Course).filter(models.Course.id == cert.course_id).first()
        course_name = course.title if course else "EduVerse Programming Course"

    # Ensure certificate_id and token exist
    if not cert.certificate_id:
        cert.certificate_id = f"EV-RA-2026-{secrets.token_hex(4).upper()}"
        db.commit()

    if not cert.verification_token:
        cert.verification_token = secrets.token_hex(32)
        db.commit()

    # Parse skills
    skills_list = []
    if cert.skills:
        skills_list = [s.strip() for s in cert.skills.split(',') if s.strip()]
    if not skills_list:
        skills_list = ["Replit Agent", "Next.js 16", "LLMs", "Vector Search", "FastAPI"]

    cert_status = cert.status if cert.status else "Verified"

    return schemas.CertificateVerificationResponse(
        valid=(cert_status == "Verified"),
        status=cert_status,
        certificate_id=cert.certificate_id,
        verification_token=cert.verification_token,
        uuid=cert.uuid,
        student_name=cert.recipient_name,
        student_email=cert.student_email or "student@eduverse.com",
        course_name=course_name,
        issue_date=cert.issue_date or datetime.datetime.utcnow(),
        completion_date=cert.completion_date or datetime.datetime.utcnow(),
        hours_completed=cert.hours_completed or 40,
        skills=skills_list,
        grade=cert.grade or "Distinction",
        revocation_reason=cert.revocation_reason,
        instructor="Beshoy Simon & Replit AI Team",
        program="EduVerse Signature Program",
        verification_url=f"/verify/{cert.certificate_id}"
    )


@router.post("/issue", response_model=schemas.CertificateOut)
def issue_certificate(
    req: schemas.CertificateIssueRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Issue a real production certificate with cryptographically generated non-sequential IDs.
    """
    cert_id = generate_unique_cert_id(db)
    token = generate_verification_token(db)
    new_uuid = str(uuid.uuid4())
    now = datetime.datetime.utcnow()

    cert = models.Certificate(
        user_id=req.user_id,
        course_id=req.course_id,
        uuid=new_uuid,
        certificate_id=cert_id,
        verification_token=token,
        recipient_name=req.student_name,
        student_email=req.student_email,
        course_title=req.course_name,
        issue_date=now,
        completion_date=now,
        hours_completed=req.hours_completed or 40,
        skills=req.skills or "Replit Agent, Next.js 16, LLMs, Vector Search, FastAPI",
        grade=req.grade or "Distinction",
        status="Verified"
    )

    db.add(cert)
    db.commit()
    db.refresh(cert)

    return schemas.CertificateOut(
        id=cert.id,
        uuid=cert.uuid,
        certificate_id=cert.certificate_id,
        verification_token=cert.verification_token,
        issue_date=cert.issue_date,
        recipient_name=cert.recipient_name,
        course_title=cert.course_title,
        status=cert.status
    )


@router.post("/admin/revoke/{certificate_id}")
def revoke_certificate(
    certificate_id: str,
    reason: str = "Revoked by EduVerse Administration",
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin Endpoint: Revoke a certificate by certificate_id or uuid.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required.")

    cert = db.query(models.Certificate).filter(
        (models.Certificate.certificate_id == certificate_id) |
        (models.Certificate.uuid == certificate_id)
    ).first()

    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found.")

    cert.status = "Revoked"
    cert.revocation_reason = reason
    db.commit()

    return {"status": "success", "message": f"Certificate {certificate_id} has been revoked."}


@router.get("/user", response_model=list[schemas.CertificateOut])
def get_user_certificates(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == current_user.id).all()
    
    out = []
    for c in certs:
        course_title = c.course_title
        if not course_title:
            course = db.query(models.Course).filter(models.Course.id == c.course_id).first()
            course_title = course.title if course else "EduVerse Course"

        out.append(
            schemas.CertificateOut(
                id=c.id,
                uuid=c.uuid,
                certificate_id=c.certificate_id,
                verification_token=c.verification_token,
                issue_date=c.issue_date,
                recipient_name=c.recipient_name,
                course_title=course_title,
                status=c.status or "Verified"
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
        
    course_title = cert.course_title
    if not course_title:
        course = db.query(models.Course).filter(models.Course.id == cert.course_id).first()
        course_title = course.title if course else "EduVerse Course"
    
    return schemas.CertificateOut(
        id=cert.id,
        uuid=cert.uuid,
        certificate_id=cert.certificate_id,
        verification_token=cert.verification_token,
        issue_date=cert.issue_date,
        recipient_name=cert.recipient_name,
        course_title=course_title,
        status=cert.status or "Verified"
    )


@router.get("/download/{cert_uuid}")
def download_certificate(cert_uuid: str, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter(models.Certificate.uuid == cert_uuid).first()
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
        
    cert_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "certificates")
    pdf_path = os.path.join(cert_dir, f"{cert_uuid}.pdf")
    
    if not os.path.exists(pdf_path):
        os.makedirs(cert_dir, exist_ok=True)
        course_title = cert.course_title or "EduVerse Programming Course"
        date_str = cert.issue_date.strftime("%Y-%m-%d") if cert.issue_date else "2026-08-02"
        
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
        filename=f"EduVerse_Certificate_{cert.certificate_id or cert_uuid[:8]}.pdf"
    )
