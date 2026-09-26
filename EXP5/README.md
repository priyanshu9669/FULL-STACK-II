# Unit 2: Experiment 5 — Separate Servers Architecture (Frontend & Backend)

This project strictly separates the **Frontend** and **Backend** across two independent servers communicating via **Cross-Origin Resource Sharing (CORS)**:

```
┌─────────────────────────────────┐           CORS HTTP Requests            ┌──────────────────────────────────┐
│   SERVER 1: Frontend Client    │ ──────────────────────────────────────> │    SERVER 2: Spring Boot API    │
│      http://localhost:5173      │ <────────────────────────────────────── │       http://localhost:8080      │
│   (Vite + React Single Page)    │      X-Correlation-ID, X-Execution-Time │    (Layered Architecture + MDC)  │
└─────────────────────────────────┘                                         └──────────────────────────────────┘
```

---

## 🏗️ Architecture Breakdown

1. **Backend Server (`backend/`)**:
   - Runs independently on **`http://localhost:8080`**
   - Pure REST API server (serves `/api/posts`, `/api/health`, `/api/traces`)
   - Emits SLF4J MDC logs, enforces Jakarta Bean Validation, handles exceptions globally with `@RestControllerAdvice`, and serves CORS headers.

2. **Frontend Server (`frontend/`)**:
   - Runs independently on **`http://localhost:5173`**
   - Independent Node / Vite dev server
   - Dispatches cross-origin asynchronous `fetch` requests with `X-Correlation-ID` to `http://localhost:8080`.

---

## 🚀 How to Run Both Servers in VS Code

### Method 1: Two Integrated Terminals (Standard Developer Workflow)

1. Open the project folder in VS Code:
   ```
   C:\Users\singh\.gemini\antigravity\scratch\springboot-rest-api-lab
   ```

2. **Terminal 1 — Start the Backend Server (Port 8080):**
   - Press **``Ctrl + ` ``** to open the terminal.
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
   *Backend is now running at `http://localhost:8080`.*

3. **Terminal 2 — Start the Frontend Server (Port 5173):**
   - Click the **`+`** (or Split Terminal icon) at the top right of the terminal panel:
   ```powershell
   cd frontend
   npm run dev
   ```
   *Frontend is now running at `http://localhost:5173`.*

4. **Open your browser and navigate to:**
   👉 **`http://localhost:5173`**

---

### Method 2: One-Click Launch via `start-all.bat`

In the VS Code File Explorer (or Windows Explorer), simply double-click:
📁 **[`start-all.bat`](start-all.bat)**

This automatically launches:
- Window 1: **Spring Boot Backend** (`http://localhost:8080`)
- Window 2: **Vite React Frontend** (`http://localhost:5173`)

---

### Method 3: VS Code Tasks Menu

1. Press **`Ctrl + Shift + P`**
2. Type **`Tasks: Run Task`** and press **Enter**
3. Select **`Run Both: Backend (:8080) + Frontend (:5173)`**
   *VS Code will launch both servers in parallel in separate terminal tabs!*

---

## 🌐 Verifying Separate Servers & CORS in the Browser

1. Open **`http://localhost:5173`** in Chrome/Edge/Firefox.
2. Open Browser DevTools (**`F12`** $\rightarrow$ **Network** tab).
3. Click any action (e.g., **Create Post**, **Bean Validation Lab**, or **Exception Handling Lab**):
   - You will see the network request origin is:
     `Origin: http://localhost:5173`
   - Target request URL is:
     `Request URL: http://localhost:8080/api/posts`
   - Response headers include:
     `Access-Control-Allow-Origin: *`
     `X-Correlation-ID: corr-ui-xyz`
     `X-Execution-Time-Ms: 8`
4. If you visit **`http://localhost:8080`** directly, you will see the pure JSON API status message confirming it is strictly an API backend.
