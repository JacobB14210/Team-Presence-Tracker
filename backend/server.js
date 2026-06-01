const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({ // Connect to the SQL Server
    host: "127.0.0.1",
    user: "root",
    password: "JamsterSQL14210!",
    database: "team_data"
});

db.connect((err) => { // Checks for connection fail
    if (err) {
        console.error("Database connection failed:");
        console.error(err);
        return;
    }

    console.log("Connected to Database");
});

// Get user from username call
app.get("/username", (req, res) => {
    const username = req.query.username;
    const sql =
        "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(result[0]);
    });
});

// Get user from email call
app.get("/email", (req, res) => {
    const email = req.query.email;
    const sql = 
        "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        
        res.json(result[0]);
    });
});

// Post login from login page
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        if (results.length === 0) {
            return res.json({
                success: false
            });
        }

        const user = results[0];
        // TODO: Hash password
        if (user.pass_hash === password) {
            return res.json({
                success: true
            });
        }

        res.json({
            success: false
        });
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});