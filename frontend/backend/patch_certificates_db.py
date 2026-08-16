import sqlite3
import os
import secrets
import datetime
import uuid

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "eduverse.db")

print(f"Connecting to SQLite database: {db_path}")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Columns to add if they do not exist
columns_to_add = [
    ("certificate_id", "VARCHAR"),
    ("verification_token", "VARCHAR"),
    ("student_email", "VARCHAR"),
    ("course_title", "VARCHAR"),
    ("completion_date", "DATETIME"),
    ("hours_completed", "INTEGER DEFAULT 40"),
    ("skills", "VARCHAR DEFAULT 'Replit Agent, LLMs, Vector Search, FastAPI'"),
    ("grade", "VARCHAR DEFAULT 'Distinction'"),
    ("status", "VARCHAR DEFAULT 'Verified'"),
    ("revocation_reason", "VARCHAR"),
    ("certificate_url", "VARCHAR"),
    ("created_at", "DATETIME"),
    ("updated_at", "DATETIME")
]

# Check existing columns
cursor.execute("PRAGMA table_info(certificates)")
existing_cols = [col[1] for col in cursor.fetchall()]

for col_name, col_type in columns_to_add:
    if col_name not in existing_cols:
        print(f"Adding column '{col_name}' to certificates table...")
        try:
            cursor.execute(f"ALTER TABLE certificates ADD COLUMN {col_name} {col_type}")
        except Exception as e:
            print(f"Error adding {col_name}: {e}")

# Create unique indexes
try:
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_cert_id ON certificates(certificate_id)")
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_cert_token ON certificates(verification_token)")
except Exception as e:
    print(f"Index creation note: {e}")

conn.commit()

# Ensure at least 1 verified certificate exists for testing
cursor.execute("SELECT COUNT(*) FROM certificates WHERE certificate_id IS NOT NULL")
count = cursor.fetchone()[0]

if count == 0:
    print("Seeding verified certificates into SQLite database...")
    
    # Generate cryptographic IDs
    rand_suffix = secrets.token_hex(4).upper()
    cert_id = f"EV-RA-2026-{rand_suffix}"
    token = secrets.token_hex(32)
    sample_uuid = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()
    
    cursor.execute("""
        INSERT INTO certificates (
            user_id, course_id, uuid, certificate_id, verification_token,
            recipient_name, student_email, course_title, issue_date, completion_date,
            hours_completed, skills, grade, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        1, 1, sample_uuid, cert_id, token,
        "Beshoy Simon", "beshoysimon0@gmail.com", "Replit AI Academy",
        now_str, now_str, 40,
        "Replit Agent, Next.js 16, LLM Prompting, Vector Databases, FastAPI, Supabase",
        "Distinction", "Verified"
    ))
    
    # Seed a sample revoked certificate for verification testing
    rev_cert_id = f"EV-RA-2026-REVOKED"
    rev_token = secrets.token_hex(32)
    rev_uuid = str(uuid.uuid4())
    
    cursor.execute("""
        INSERT INTO certificates (
            user_id, course_id, uuid, certificate_id, verification_token,
            recipient_name, student_email, course_title, issue_date, completion_date,
            hours_completed, skills, grade, status, revocation_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        1, 1, rev_uuid, rev_cert_id, rev_token,
        "John Doe Test", "johndoe@example.com", "Replit AI Academy",
        now_str, now_str, 40,
        "Python Basics", "Fail", "Revoked",
        "Official revocation by EduVerse administration due to academic policy review."
    ))
    
    conn.commit()
    print(f"Successfully seeded Test Verified Certificate: {cert_id}")
    print(f"Successfully seeded Test Revoked Certificate: {rev_cert_id}")

conn.close()
print("Database patch completed.")
