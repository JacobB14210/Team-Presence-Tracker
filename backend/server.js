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
    const { email, password } = req.body;

    const getEmailSQL =
        "SELECT * FROM users WHERE email = ?";

    db.query(getEmailSQL, [email], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        if (results.length === 0) { // Check if user exists in database
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        const user = results[0];
        
        // TODO: Hash password
        if (user.pass_hash === password) {
            return res.json({
                success: true,
                id: user.id,
                name: user.name,
                email: user.email
            });
        }

        return res.json({
            success: false
        });
    });
});

// Post for google login
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

        const getEmailSQL =
            "SELECT * FROM users WHERE email = ?";

        db.query(getEmailSQL, [email], (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false
                });
            }

            if (results.length === 0) { // Check if user exists in database
                return res.json({
                    success: false,
                    message: "User does not exist"
                });
            }

            const user = results[0];

            return res.json({
                success: true,
                id: user.id,
                name: user.name,
                email: user.email
            });
        });
    }
    catch (err) {
        console.error(err);

        return res.status(401).json({
            success: false
        });
    }
});

// Post new account from create account page
app.post("/create", (req, res) => {
    const { email, name, password, emp_type } = req.body;

    // Check if email already exists
    const getEmailSQL =
        "SELECT * FROM users WHERE email = ?";

    db.query(getEmailSQL, [email], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        if (results.length > 0) {
            return res.json({
                success: false,
                message: "Email is already used"
            });
        }

        const insertUserSQL =
            "INSERT INTO users (email,name,pass_hash,emp_type) VALUES (?, ?, ?, ?)";
        
        db.query(insertUserSQL, [email, name, password, emp_type], (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error creating account"
                });
            }

            return res.json({
                success: true,
                message: "Successfully created account"
            });
        })
    });
});

// Post time off request from time off request page
app.post("/request-off", async (req, res) => {
    const { userID, startDate, endDate, reason, leaveEarly, returnLate, leaveTime, returnTime }
        = req.body;

    const insertTimeSQL = `INSERT INTO time_off 
        (user_id, start_date, end_date, reason, leave_early, return_late, leave_time, return_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertTimeSQL, [userID, startDate, endDate, reason, leaveEarly, returnLate, leaveTime || null, returnTime || null],
        (err, results) => {
            if (err) {
                console.error("Error creating time off request:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create time off request"
                });
            }

            return res.json({
                success: true,
                message: "Time off request submitted"
            });
        }
    );
})

// Get time off request for selected day
app.get("/time-off", (req, res) => {
    const { date } = req.query;

    const getRequestCardSQL = `
        SELECT
            time_off.id,
            time_off.user_id,
            users.name,
            time_off.start_date,
            time_off.end_date,
            time_off.reason,
            time_off.leave_early,
            time_off.return_late,
            time_off.leave_time,
            time_off.return_time
        FROM time_off
        JOIN users
            ON time_off.user_id = users.id
        WHERE ? BETWEEN time_off.start_date AND time_off.end_date`;

    db.query(getRequestCardSQL, [date], (err, results) => {
        if (err) {
            console.error("Error creating time off request:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to create time off request"
            });
        }

        console.log(results)

        res.json({
            success: true,
            requests: results
        });
    })
})

app.listen(5000, () => {
    console.log("Server running on port 5000");
});