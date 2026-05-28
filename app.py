from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
import sqlite3
import bcrypt
import random

app = Flask(__name__)

@app.after_request
def add_header(response):

    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response

app.secret_key = "your_secret_key"
CORS(app)

DB = "database.db"


def generate_userid(name):
    first = name[0].upper()
    last = name[-1].upper()
    number = random.randint(10000, 99999)

    return f"{number}{first}{last}"


@app.route("/")
def home():
    return render_template("login.html")

@app.route("/signup-page")
def signup_page():
    return render_template("signup.html")

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

    except sqlite3.IntegrityError:
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
            session["user"] = user[0]
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


# DASHBOARD PAGE
@app.route("/dashboard")
def dashboard():

    if "user" not in session:
        return redirect(url_for("home"))

    return render_template("dashboard.html")


# DASHBOARD PAGE
@app.route("/newloan")
def newloan():

    if "user" not in session:
        return redirect(url_for("home"))

    return render_template("newloan.html")

# LOGOUT
@app.route("/logout")
def logout():

    session.clear()

    response = redirect(url_for("home"))

    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response



@app.route("/calculator")
def calculator():
    if "user" not in session:
        return redirect(url_for("home"))
    return render_template("calculator.html")


@app.route("/schedules")
def schedules():
    if "user" not in session:
        return redirect(url_for("home"))
    return render_template("schedule.html")


@app.route("/reports")
def reports():
    if "user" not in session:
        return redirect(url_for("home"))
    return render_template("reports.html")


@app.route("/settings")
def settings():
    if "user" not in session:
        return redirect(url_for("home"))
    return render_template("settings.html")



if __name__ == "__main__":
    app.run(debug=False)