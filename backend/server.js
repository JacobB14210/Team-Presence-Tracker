const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const { OAuth2Client } =
    require("google-auth-library");

const CLIENT_ID =
    "957508522472-e4u0en5ghj58g7vqkfu8h8pb6dbnmke2.apps.googleusercontent.com";

const client =
new OAuth2Client(CLIENT_ID);

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

app.post("/google-login", async (req, res) => {

    const { token } = req.body;

    try {
        const ticket =
            await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            });

        const payload =
            ticket.getPayload();

        const email =
            payload.email;

        const name =
            payload.name;

        res.json({
            success: true,
            email,
            name
        });

    } catch (err) {
        console.error(err);

        res.status(401).json({
            success: false
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});