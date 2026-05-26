from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
import random

app = Flask(__name__)
CORS(app)

DB = "database.db"


def generate_userid(name):
    first = name[0].upper()
    last = name[-1].upper()
    number = random.randint(10000, 99999)

    return f"{number}{first}{last}"


# REGISTER
@app.route("/signup", methods=["POST"])
def signup():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]
    emprole = data["EmpRole"]

    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()

    userid = generate_userid(name)

    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO user
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            userid,
            name,
            email,
            hashed,
            emprole,
            "Admin"
        ))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "User created successfully"
        })

    except:
        return jsonify({
            "success": False,
            "message": "Email already exists"
        })

    finally:
        conn.close()


# LOGIN
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM user WHERE email=?
    """, (email,))

    user = cursor.fetchone()

    conn.close()

    if user:

        db_password = user[3]

        if bcrypt.checkpw(
            password.encode(),
            db_password.encode()
        ):

            return jsonify({
                "success": True,
                "userid": user[0],
                "name": user[1],
                "email": user[2],
                "EmpRole": user[4],
                "Role": user[5]
            })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })


# UPDATE USER
@app.route("/update-user", methods=["POST"])
def update_user():

    data = request.json

    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE user
    SET name=?,
        email=?,
        EmpRole=?
    WHERE userid=?
    """, (
        data["name"],
        data["email"],
        data["EmpRole"],
        data["userid"]
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Changes saved"
    })


# CHANGE PASSWORD
@app.route("/change-password", methods=["POST"])
def change_password():

    data = request.json

    userid = data["userid"]
    current = data["currentPassword"]
    new = data["newPassword"]

    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT password FROM user
    WHERE userid=?
    """, (userid,))

    db_password = cursor.fetchone()[0]

    if bcrypt.checkpw(current.encode(), db_password.encode()):

        hashed = bcrypt.hashpw(
            new.encode(),
            bcrypt.gensalt()
        ).decode()

        cursor.execute("""
        UPDATE user
        SET password=?
        WHERE userid=?
        """, (hashed, userid))

        conn.commit()

        return jsonify({
            "success": True
        })

    return jsonify({
        "success": False,
        "message": "Current password incorrect"
    })


# DELETE ACCOUNT
@app.route("/delete-user", methods=["POST"])
def delete_user():

    data = request.json

    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    DELETE FROM user
    WHERE userid=?
    """, (data["userid"],))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True
    })


if __name__ == "__main__":
    app.run(debug=False)