require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const bcrypt = require(`bcrypt`);
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const { OAuth2Client } = require("google-auth-library");

const CLIENTID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENTID);

const db = mysql.createConnection({ // Connect to the SQL Server
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DATABASE
});

db.connect((err) => { // Checks for connection fail
    if (err) {
        console.error("Database connection failed:");
        console.error(err);
        return;
    }

    console.log("Connected to Database");
});

// Authenticate the gmail user
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASS
    }
});

// Schedule sendDailyEmails function every 7 am, mon - fri
cron.schedule("0 7 * * 1-5", async () => {
    const today = new Date().toISOString().split("T")[0];
    const timeOffResults = await getAllApproved(today); // Get all user's time off for today

    const emailResults = await getAllEmails(); // Get all emails in the database to send daily email to
    const text = buildEmailText(timeOffResults, today); // Format text of email

    await sendDailyEmail(emailResults, text);
});

// TODO: Delete after
// http://localhost:${port}/demo
app.get("/demo", async (req, res) => {
    try {
        await testNoTimeOff();

        const today = new Date().toISOString().split("T")[0];
        const timeOffResults = await getAllApproved(today); // Get all user's time off for today

        const emailResults = await getAllEmails(); // Get all emails in the database to send daily email to
        const text = buildEmailText(timeOffResults, today); // Format text of email
        await sendDailyEmail(emailResults, text); // Test a normal email

        res.json({
            success: true,
            message: "Test email sent"
        });
    }
    catch (error) {
        console.error("Test text error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send email"
        });
    }
});

// Test for when there is no time off that day
async function testNoTimeOff() {
    try {
        const date = new Date("2026-09-14");
        const timeOffResults = await getAllApproved(date);

        const emailResults = await getAllEmails(); // Get all emails in the database to send daily email to
        const text = buildEmailText(timeOffResults, date); // Format text of email
        
        await sendDailyEmail(emailResults, text);
    }
    catch (error) {
      console.error("Error sending daily email:", error);
    }
}

// Sends the daily email
async function sendDailyEmail(emails, text) {
    try {
        await transporter.sendMail({ // Send the daily email
            from: process.env.EMAIL_USER,
            to: emails,
            subject: "Team Presence Update",
            text: `${text}`
        });

        console.log("Daily email sent successfully");
    }
    catch (error) {
        console.error("Error sending daily email:", error);
    }
}

// Build text of the email
function buildEmailText(timeOffResults, today) {
    let text = "Approved Time Off\n";

    if (timeOffResults.length === 0) {
        return "No approved time off"
    }

    timeOffResults.forEach((request, index) => {
        text += `${index + 1}. ${request.name}`;

        const startDate = new Date(request.start_date)
            .toISOString()
            .split("T")[0];

        const endDate = new Date(request.end_date)
            .toISOString()
            .split("T")[0];

        if (request.leave_early && startDate === today) {
            text += `, Leave early: ${request.leave_time}`;
        }

        if (request.return_late && endDate === today) {
            text += `, Return late: ${request.return_time}`;
        }

        text += "\n";
        
    });

    return text;

}

// Get all the emails to send daily notification to
async function getAllEmails() {
    const getAllEmailsSQL = "SELECT email FROM users";

    return new Promise((resolve, reject) => {
        db.query(getAllEmailsSQL, (err, res) => {
            if (err) {
                reject(err);

                return;
            }

            const emails = res.map(user => user.email);

            console.log("Retrieved all emails");

            resolve(emails);
        });
    });
}

// Get all the approved time off for the date
async function getAllApproved(date) {
    const getAllApprovedSQL = `
        SELECT
            time_off.id,
            time_off.user_id,
            users.name,
            time_off.start_date,
            time_off.end_date,
            time_off.leave_early,
            time_off.return_late,
            time_off.leave_time,
            time_off.return_time
        FROM time_off
        JOIN users
            ON time_off.user_id = users.id
        WHERE ? BETWEEN time_off.start_date AND time_off.end_date
            AND status = 'approved'
    `;

    return new Promise((resolve, reject) => {
        db.query(getAllApprovedSQL, [date], (err, results) => {
            if (err) {
                reject(err);

                return;
            }

            console.log("Retrieved all approved time off")

            resolve(results);
        });
    });
}

// Function to authenticate a user
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) { // Check if user has authentication token
        console.log("Authentication required");

        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    jwt.verify( // Create a JWT token
        token,
        process.env.JWT_SECRET,
        (err, user) => {
            if (err) {
                console.log("Error Authenticating");

                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }

            console.log("Authenticated User");

            req.user = user;

            next();
        }
    )
}

// Function to authenticate the Admin role
function requireAdmin(req, res, next) {
    if (req.user.role !== "Admin") { // Check if user has admin role
        console.log("Admin access required");

        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    console.log("Authenticated Admin")

    next();
}

// Get approved time off for selected day
app.get("/time-off", authenticateToken, (req, res) => {
    const { date } = req.query;

    const getApprovedTimeOffDateSQL = `
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
        WHERE ? BETWEEN time_off.start_date AND time_off.end_date
            AND status = 'approved'
    `;

    db.query(getApprovedTimeOffDateSQL, [date], (err, results) => {
        if (err) {
            console.error(`Error getting approved time off for ${date}: `, err);

            return res.status(500).json({
                success: false,
                message: `Failed to get approved time off for ${date}`
            });
        }

        console.log(`Retrieved approved time off for ${date}`);

        res.json({
            success: true,
            requests: results
        });
    })
});

// Get all approved time off
app.get("/all-time-off", authenticateToken, (req, res) => {
    const getAllApprovedTimeOffSQL = `
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
        WHERE status = 'approved'
    `;

    db.query(getAllApprovedTimeOffSQL, (err, results) => {
        if (err) {
            console.error("Error getting all time off: ", err);

            return res.status(500).json({
                success: false,
                message: "Failed to get all approved time off"
            });
        }

        console.log("Retrieved all approved time off");

        res.json({
            success: true,
            requests: results
        });
    });
});

// Get all pending time off requests
app.get("/pending", authenticateToken, requireAdmin, (req, res) => {
    const getAllPendingSQL = `
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
        WHERE status = 'pending'
    `;

    db.query(getAllPendingSQL, (err, results) => {
        if (err) {
            console.error("Error getting all pending time off requests: ",err);

            return res.status(500).json({
                success: false,
                message: "Failed to get all pending time off requests"
            });
        }

        console.log("Retrieved all pending time off requests")

        res.json({
            success: true,
            requests: results
        });
    });
});

// Post login from login page
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const getEmailSQL = "SELECT * FROM users WHERE email = ?";

    db.query(getEmailSQL, [email], async (err, results) => {
        if (err) {
            console.error("Error loging in: ", err);

            return res.status(500).json({
                success: false,
                message: "Login error"
            });
        }

        if (results.length === 0) { // Check if user exists in database
            console.log(`User does not exist for email: ${email}`);

            return res.json({
                success: false,
                message: "Password or email is incorrect"
            });
        }

        // Get only user in database
        const user = results[0];
        
        // Check if hashed passwords match
        const passwordMatch = await bcrypt.compare(password, user.pass_hash);

        // Create jwt token for user if passwords match
        if (passwordMatch) {
            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.emp_type
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            console.log(`Logged in and created JWT token for user ${email}`);

            return res.json({
                success: true,
                token: token,
                id: user.id,
                name: user.name,
                email: user.email,
                emp_type: user.emp_type
            });
        }

        return res.json({
            success: false,
            message: "Password or email is incorrect"
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
                audience: CLIENTID,
            });

        const payload = ticket.getPayload();

        const email = payload.email;

        const getEmailSQL = "SELECT * FROM users WHERE email = ?";

        db.query(getEmailSQL, [email], (err, results) => {
            if (err) {
                console.error("Google login error: ", err);

                return res.status(500).json({
                    success: false,
                    message: "Google login error"
                });
            }

            if (results.length === 0) { // Check if user exists in database
                return res.json({
                    success: false,
                    message: "Password or email is incorrect"
                });
            }

            const user = results[0];

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.emp_type
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            console.log(`Logged in and created JWT token for user ${email}`);

            return res.json({
                token: token,
                success: true,
                id: user.id,
                name: user.name,
                email: user.email,
                emp_type: user.emp_type
            });
        });
    }
    catch (err) {
        console.error(err);

        return res.status(401).json({
            success: false,
            message: "Password or email is incorrect"
        });
    }
});

// Post new account from create account page
app.post("/create", async (req, res) => {
    const { email, name, password, emp_type } = req.body;

    const getEmailSQL = "SELECT * FROM users WHERE email = ?";

    // Check if email already exists
    db.query(getEmailSQL, [email], async (err, results) => {
        if (err) {
            console.error("Error checking for existing email");

            return res.status(500).json({
                success: false,
                message: "Error checking for existing email"
            });
        }

        if (results.length > 0) {
            return res.json({
                success: false,
                message: "Email is already used"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserSQL = `
            INSERT INTO users
                (email,name,pass_hash,emp_type)
            VALUES
                (?, ?, ?, ?)
        `;
        
        db.query(insertUserSQL, [email, name, hashedPassword, emp_type], (err, results) => {
            if (err) {
                console.error("Error adding new user to database");

                return res.status(500).json({
                    success: false,
                    message: "Error creating account"
                });
            }

            console.log("Created new user");

            return res.json({
                success: true,
                message: "Successfully created account"
            });
        })
    });
});

// Post time off request from time off request page
app.post("/request-off", authenticateToken, async (req, res) => {
    const { userID, startDate, endDate, reason, leaveEarly, returnLate, leaveTime, returnTime } = req.body;

    const insertTimeSQL = `
        INSERT INTO time_off
            (user_id, start_date, end_date, reason, leave_early, return_late, leave_time, return_time)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertTimeSQL, [userID, startDate, endDate, reason, leaveEarly, returnLate, leaveTime || null, returnTime || null],
        (err, results) => {
            if (err) {
                console.error("Error creating time off request:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create time off request"
                });
            }

            console.log("Created a new time off request");

            return res.json({
                success: true,
                message: "Time off request submitted"
            });
        }
    );
});

// Approve time off request
app.post("/approve-request", authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.body;

    const approveRequestSQL = `
        UPDATE
            time_off
        SET
            status = 'approved'
        WHERE
            id = ?
    `;

    db.query(approveRequestSQL, [id], (err, results) => {
        if (err) {
            console.error("Error changing status of request: ", err);

            return res.status(500).json({
                success: false,
                message: "Failed to change status of request"
            });
        }

        console.log("Changed status of time off request to approve");

        return res.json({
            success: true,
            message: "Changed status of time off request to approve"
        });
    })
});

// Deny time off request
app.post("/deny-request", authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.body;

    const denyRequstSQL = `
        UPDATE
            time_off
        SET
            status = 'deny'
        WHERE id = ?
    `;

    db.query(denyRequstSQL, [id], (err, results) => {
        if (err) {
            console.error("Error changing status of request: ", err);

            return res.status(500).json({
                success: false,
                message: "Failed to change status of request"
            });
        }

        console.log("Changed staus of time off request to deny");

        res.json({
            success: true,
            message: "Changed status of time off request to deny"
        });
    })
});

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server running on selected port");
});