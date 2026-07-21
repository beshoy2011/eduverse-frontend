import sqlite3
import json

conn = sqlite3.connect('eduverse.db')
cur = conn.cursor()

user_id = 12  # ceo@eduverse.com

unlocked_items = json.dumps([
    'item_streak_freeze', 'frame_rainbow', 'frame_neon', 'frame_gold',
    'theme_cyberpunk', 'theme_matrix', 'theme_neon'
])
achievements = json.dumps([
    'first_steps', 'first_cert', 'perfect_score', 'polyglot_coder',
    'ai_specialist', 'web_master', 'cpp_master', 'python_master'
])

cur.execute("""
    UPDATE users SET
        xp = 999999,
        level = 100,
        rank = 'EduVerse Champion',
        completed_courses_count = 30,
        certificates_count = 30,
        streak_days = 365,
        streak_freezes = 99,
        achievements = ?,
        unlocked_items = ?,
        active_frame = 'frame_rainbow',
        active_theme = 'theme_matrix'
    WHERE id = ?
""", (achievements, unlocked_items, user_id))

conn.commit()
print(f"Updated rows: {cur.rowcount}")

cur.execute("SELECT id, name, email, xp, level, rank, completed_courses_count, certificates_count, streak_days FROM users WHERE id = ?", (user_id,))
row = cur.fetchone()
print(f"New data: {row}")

# Show full leaderboard order
cur.execute("SELECT name, xp, level, rank FROM users ORDER BY xp DESC LIMIT 10")
print("\n=== LEADERBOARD (top 10) ===")
for i, r in enumerate(cur.fetchall(), 1):
    print(f"#{i} {r[0]} | XP: {r[1]} | Level: {r[2]} | Rank: {r[3]}")

conn.close()
