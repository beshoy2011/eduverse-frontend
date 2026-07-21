import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime

# Load SMTP configs from environment
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "certificates@eduverse.org")

def send_certificate_email(recipient_email: str, recipient_name: str, course_name: str, pdf_path: str) -> bool:
    subject = f"Congratulations on completing {course_name}! - EduVerse"
    body = f"""Dear {recipient_name},

Congratulations! You have successfully completed the course "{course_name}" on EduVerse.

We are thrilled to present you with your official Certificate of Completion, attached to this email. You can also view and download it directly from your dashboard on the EduVerse platform.

Keep up the fantastic work and continue your learning journey!

Best regards,
Beshoy Simon
CEO, EduVerse Team
"""
    
    # If no SMTP configurations exist, fall back to logging in a local file
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        log_dir = os.path.dirname(os.path.abspath(pdf_path))
        log_file = os.path.join(log_dir, "sent_emails_log.txt")
        log_entry = (
            f"=== EMAIL LOG ({datetime.now().isoformat()}) ===\n"
            f"To: {recipient_email}\n"
            f"Subject: {subject}\n"
            f"Attachment: {pdf_path}\n"
            f"Body:\n{body}\n"
            f"=========================================\n\n"
        )
        try:
            with open(log_file, "a") as f:
                f.write(log_entry)
            print(f"[Email Simulator] Logged email to {log_file}")
            return True
        except Exception as e:
            print(f"[Email Simulator] Failed to write mock email: {e}")
            return False
            
    # Send actual email
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Read and attach PDF file
        if os.path.exists(pdf_path):
            with open(pdf_path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f"attachment; filename={os.path.basename(pdf_path)}",
                )
                msg.attach(part)
        
        # Connect and send
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Successfully sent certificate email to {recipient_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {recipient_email} due to error: {e}")
        # Log to local file anyway as backup recovery path
        log_dir = os.path.dirname(os.path.abspath(pdf_path))
        log_file = os.path.join(log_dir, "sent_emails_failed_backup.txt")
        log_entry = (
            f"=== FAILED SMTP LOG ({datetime.now().isoformat()}) ===\n"
            f"Error: {e}\n"
            f"To: {recipient_email}\n"
            f"Subject: {subject}\n"
            f"Attachment: {pdf_path}\n"
            f"==================================================\n\n"
        )
        try:
            with open(log_file, "a") as f:
                f.write(log_entry)
        except:
            pass
        return False
