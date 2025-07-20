# 🔐 Auth Frontend – Vite + React + Material UI

This is the frontend of the MERN stack authentication system using:

- ✅ React with Vite
- ✅ TypeScript
- ✅ Material UI
- ✅ JWT-based access and refresh token system
- ✅ Axios with automatic token refresh and route protection

---

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/anugrahs123/Login-Section-Frontend.git
cd Login-Section-Frontend

### 2. Install Dependencies

npm install

# or

yarn install

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

VITE_APP_API_URL=http://localhost:5000/v1

Make sure this URL matches the backend API base URL.

### 4. Start the Dev Server

npm start

# or

yarn start

```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

##  Authentication Flow

This app supports:

| Feature                                 | Status |
| --------------------------------------- | ------ |
| Login with access & refresh token       | ✅     |
| Route protection with access token      | ✅     |
| Axios interceptor attaches access token | ✅     |
| Access token auto-refresh using refresh | ✅     |
| Logout clears both tokens               | ✅     |
| Refresh-token retry logic on 401        | ✅     |

---

##  Login Credentials

Login credentials for testing are defined in the backend repository’s `README.md` under the `user.json` section.
Please refer to that file for valid `email` and `password` combinations.

---

##  Access Token Refresh Logic

### How to Test:

1. **Login to the app**
2. Wait for **access token** to expire (default: e.g. 15 minutes)
3. Click **“Refresh User Details”** on the Dashboard

Note: For instant testing, you can adjust the token expiry duration by modifying the expiresIn value in the src/utils/token.ts file in the backend.

The app will:

- Detect the expired access token (401 from backend)
- Silently use the **refresh token**
- Re-fetch the access token
- Retry the original request
- Update UI with new user details

> You can **adjust token expiry duration** from the backend for faster testing.
> Check the backend file: `src/config/jwt.ts` or wherever token TTLs are set (`access.tokenExpiresIn`, `refresh.tokenExpiresIn`).

---

##  Debugging Tips

- Check **DevTools → Network tab**
  - Watch for `/auth/refresh-token` and retry of `/auth/user`
- **Console logs**:
  - `Access token expired. Trying refresh...`
  - `Refresh successful. Retrying original request...`
- App will **redirect to login** if refresh token is invalid or expired.

---


## Logout Behavior

Clicking the **Logout** button:

- Clears `accessToken` and `refreshToken` from `localStorage`
- Redirects user to login page

---

##  Private Route Handling

All protected routes are wrapped in a `PrivateRoute` component.
It checks for presence of access token and conditionally renders pages or redirects to login.

---


```
