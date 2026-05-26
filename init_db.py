import sqlite3
import bcrypt

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS user (
    userid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    EmpRole TEXT,
    Role TEXT
)
""")

# Default SuperAdmin
email = "superadmin@email.com"

cursor.execute("SELECT * FROM user WHERE email=?", (email,))
existing = cursor.fetchone()

if not existing:

    password = bcrypt.hashpw(
        "Password@123".encode(),
        bcrypt.gensalt()
    ).decode()

    cursor.execute("""
    INSERT INTO user
    (userid, name, email, password, EmpRole, Role)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "00001SA",
        "Super Admin",
        email,
        password,
        "System Administrator",
        "SuperAdmin"
    ))

conn.commit()
conn.close()

print("Database initialized successfully.")