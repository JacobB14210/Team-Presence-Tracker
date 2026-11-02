# Team Presence Tracker

# Start Servers

- Run Database
  - Win + R
  - services.mcs
  - Check for MYSQL

- Start Frontend

```
cd frontend
npm run dev -- --host 0.0.0.0
```

- Start Backend
```
cd backend
node server.js
```

# Implemented Features
- Create Account
  - Account creation using full name, email, and password
- Login
  - Login manually using credentials
  - Login using google
- Calendar
  - Displays approved time off requests from users for selected day
- Approve (Admin)
  - Admin can approve or deny time off requests
- Accounts (Admin)
  - Displays employee accounts and amount of hours they have
  - Can change the hours for that employee's account
- Time Off Request
  - Submit a time off request includeing start/end date, leave/return time, and reason
  - Displays hours balance for your account
  - Displays the history and status of time off requests submited

# Possible Errors and Fix

- Google Authentication (Access Blocked: Authorization Error)
  - Create District Domain
  - Go to API & Services -> Clients -> Client IDs
  - Add Login URL to Authroized JavaScript Origins
- API Errors
  - Ensure env variables have correct IPv4 address and ports