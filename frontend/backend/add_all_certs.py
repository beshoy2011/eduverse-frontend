import sqlite3
import uuid
from datetime import datetime, timezone

conn = sqlite3.connect('eduverse.db')
cur = conn.cursor()

# Get CEO user
cur.execute("SELECT id, name FROM users WHERE email = 'ceo@eduverse.com'")
user = cur.fetchone()
user_id, user_name = user
print(f"User: {user_name} (ID: {user_id})")

# Get all courses
cur.execute("SELECT id, title FROM courses")
courses = cur.fetchall()
print(f"Total courses: {len(courses)}")

# Get existing certs
cur.execute("SELECT course_id FROM certificates WHERE user_id = ?", (user_id,))
existing_certs = {row[0] for row in cur.fetchall()}

# Get existing enrollments
cur.execute("SELECT course_id FROM enrollments WHERE user_id = ?", (user_id,))
existing_enrollments = {row[0] for row in cur.fetchall()}

now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
certs_added = 0
enrollments_added = 0

for course_id, course_title in courses:
    # Add enrollment if not exists
    if course_id not in existing_enrollments:
        cur.execute(
            "INSERT INTO enrollments (user_id, course_id, enrolled_at, is_completed) VALUES (?, ?, ?, ?)",
            (user_id, course_id, now_str, True)
        )
        enrollments_added += 1
        print(f"  Enrolled: {course_title}")
    else:
        cur.execute("UPDATE enrollments SET is_completed = 1 WHERE user_id = ? AND course_id = ?", (user_id, course_id))
        print(f"  Already enrolled (marked complete): {course_title}")

    # Add certificate if not exists
    if course_id not in existing_certs:
        cert_uuid = str(uuid.uuid4())
        qr_url = f"https://eduverse.app/verify/{cert_uuid}"
        cur.execute(
            "INSERT INTO certificates (user_id, course_id, uuid, issue_date, recipient_name, verification_qr_code_url) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, course_id, cert_uuid, now_str, user_name.strip(), qr_url)
        )
        certs_added += 1
        print(f"  Certificate added: {course_title}")
    else:
        print(f"  Already has cert: {course_title}")

# Update user stats
total_certs = len(courses)
cur.execute(
    "UPDATE users SET certificates_count = ?, completed_courses_count = ? WHERE id = ?",
    (total_certs, total_certs, user_id)
)

conn.commit()
print(f"\nDone! Enrollments added: {enrollments_added}, Certificates added: {certs_added}, Total: {total_certs}")
conn.close()
