# Experiment 3 — Role-Based Authentication & Route Protection

A React app implementing JWT authentication, RBAC, protected routes, Axios
interceptors, and token refresh — built to satisfy every requirement in the
"Unit 1 / Experiment 3" document.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

No real backend is required — a simulated one runs entirely in the browser
(see `src/api/mockServer.js`), so this works completely offline.

## Demo accounts

| Username | Password  | Role   |
|----------|-----------|--------|
| admin    | admin123  | admin  |
| editor   | editor123 | editor |
| viewer   | viewer123 | viewer |

Try logging in as each one to see the UI and available routes change.

**To see the token refresh mechanism live:** log in and stay on the
Dashboard. The access token expires after 45 seconds (see
`ACCESS_TOKEN_TTL_SECONDS` in `mockServer.js`) — a live countdown is shown.
Once it hits 0, click anything that re-fetches posts (or wait — the app will
show "expired"), and the next API call will silently get a 401, trigger the
refresh flow, get a new token, and retry — you'll see the posts load with no
interruption and no re-login.

## How each part of the document maps to the code

| Document section | Implementation |
|---|---|
| 1. Authentication vs Authorization | `AuthContext` (identity) + `permissions.js` / `ProtectedRoute` (access) |
| 2. JWT structure (`HEADER.PAYLOAD.SIGNATURE`) | `src/utils/jwt.js` — `generateToken`, `decodeToken`, `verifyToken` |
| 3. Token storage tradeoffs | `src/api/axiosInstance.js` `tokenStorage` (localStorage, per the doc's own interceptor example — tradeoffs noted in comments) |
| 4. Axios interceptors | `src/api/axiosInstance.js` — request interceptor attaches `Authorization: Bearer <token>` to every call |
| 5. Token expiry & refresh | `src/api/axiosInstance.js` response interceptor: catches 401 → calls `/auth/refresh` → retries original request |
| 6. RBAC | `src/utils/permissions.js` — `{ admin: [...], editor: [...], viewer: [...] }` |
| 7. Protected routes | `src/routes/ProtectedRoute.jsx` |
| 8. Conditional rendering by role | `Navbar.jsx`, `Dashboard.jsx` (e.g. Delete button only for admins) |
| 9. Secure frontend architecture | Centralized `axiosInstance`, `AuthContext`, mock server enforcing RBAC server-side too (defense in depth) |
| Assignment 1 — JWT auth flow | `pages/Login.jsx` + `AuthContext.login` |
| Assignment 2 — Axios interceptor integration | `axiosInstance.js` (attach token, handle 401) |
| Assignment 3 — RBAC implementation | `permissions.js`, enforced both client-side (UI) and server-side (`mockServer.js`) |
| Assignment 4 — Protected routes | `ProtectedRoute.jsx` used in `App.jsx` for `/dashboard`, `/editor`, `/admin` |
| Assignment 5 — Token refresh mechanism | Short-lived access tokens + refresh token queueing logic in `axiosInstance.js` |

## Project structure

```
src/
  api/
    axiosInstance.js   # interceptors, token storage, refresh queueing
    authService.js      # thin wrappers around API calls
    mockServer.js        # simulated backend (login/refresh/posts, enforces RBAC)
  context/
    AuthContext.jsx      # session state, login/logout, restores session on load
  routes/
    ProtectedRoute.jsx   # route guard: auth + role check
  components/
    Navbar.jsx            # role-based conditional nav links
    RoleBadge.jsx
  pages/
    Login.jsx
    Dashboard.jsx         # protected resource, create/delete posts by role
    EditorPanel.jsx        # admin + editor only
    AdminPanel.jsx          # admin only, shows full permission matrix
    Unauthorized.jsx
    NotFound.jsx
  utils/
    jwt.js                # token generate/decode/verify/expiry
    permissions.js          # RBAC map + helpers
  App.jsx
  main.jsx
  index.css
```

## Notes on the JWT simulation

Because there is no real backend server in this exercise, `src/utils/jwt.js`
builds tokens with the same three-part `header.payload.signature` shape a
real JWT has, so the rest of the app (interceptors, decoding, expiry checks)
behaves exactly like it would against a real server. This is explicitly
called out in code comments — **it is not a cryptographically secure JWT
implementation** and should never be used in a real backend. A production
system would generate/verify tokens server-side (e.g. with the
`jsonwebtoken` npm package) using a secret that never reaches the browser.
