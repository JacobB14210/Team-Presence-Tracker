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

# Possible Errors and Fix

- Google Authentication (Access Blocked: Authorization Error)
  - Create District Domain
  - Go to API & Services -> Clients -> Client IDs
  - Add Login URL to Authroized JavaScript Origins
- API Errors
  - Ensure env variables have correct IPv4 address and ports