# Interactive Calendar — Experiment 4 (Optimization & Testing)

A working React + Vite implementation of "Experiment 4: Interactive Calendar
Optimization & Testing", covering every concept in the write-up:

- Month-grid calendar UI with **drag-and-drop** event rescheduling — works
  with both mouse (native HTML5 Drag and Drop API) and touch/mobile devices
  (custom touch-event based drag)
- **React.memo** on `EventCard` to stop unnecessary re-renders
- **useMemo** for expensive grouping/filtering (`eventsByDate`, month grid)
- **useCallback** for stable handler references (drag/drop, add/remove, nav)
- **Code splitting** via `React.lazy` + `Suspense` (`PremiumReportWidget`)
- Correct **key selection** (`event.id`, not array index) for reconciliation
- **Mock Service Worker (MSW)** simulating a real `/api/events` backend, in
  both the dev server and the test suite
- **React Testing Library** + **Vitest** (Jest-compatible API) tests that
  test behavior, not implementation, including a full drag-and-drop flow
- A live render log panel to compare against the React DevTools Profiler

## 1. Setup

Requires Node.js 18+.

```bash
npm install
```

## 2. Run the app

```bash
npm run dev
```

Open the printed local URL (usually http://localhost:5173). The app boots a
Mock Service Worker in the browser, so events persist across drag/drop and
add/remove actions for the duration of the session — no real backend needed.

## 3. Run the tests

```bash
npm test            # single run
npm run test:watch  # watch mode
npm run test:coverage  # statement/branch/function coverage report
```

`src/__tests__/EventCard.test.jsx` — unit tests for the memoized card.
`src/__tests__/Calendar.test.jsx` — integration tests: initial load via MSW,
adding an event, removing an event, a full drag-and-drop reschedule, and an
API-failure error path.

## 4. Production build (verifies code-splitting)

```bash
npm run build
npm run preview
```

Check the `dist/assets` output — `PremiumReportWidget` is emitted as its own
chunk, separate from the main bundle, and is only fetched once you click
"Show Analytics Report" in the UI.

## 5. Profiling with React DevTools

1. Install the **React Developer Tools** browser extension.
2. Run `npm run dev` and open the app, then open DevTools → **Profiler** tab.
3. Click **Record**, drag an event card to another day, click **Stop**.
4. Use the **Flame Chart** to spot wide bars (long render times) and the
   **Ranked Chart** to see which components took the longest.
5. Click a bar and check **"Why did this render?"** — you should see that
   only the source/target day cells and their `EventCard`s re-render, not
   every card on the calendar, thanks to `React.memo` + stable keys.

## Project structure

```
calendar-app/
├── index.html
├── package.json
├── vite.config.js          # Vite + Vitest (jsdom, coverage) config
├── public/
│   └── mockServiceWorker.js
└── src/
    ├── main.jsx             # boots MSW in dev, then renders <App/>
    ├── App.jsx
    ├── index.css
    ├── setupTests.js        # jest-dom matchers + MSW lifecycle hooks
    ├── api/
    │   └── events.js        # fetch wrapper (GET/POST/PATCH/DELETE)
    ├── components/
    │   ├── Calendar.jsx      # month grid, DnD, memo/useMemo/useCallback
    │   ├── EventCard.jsx     # React.memo-wrapped draggable card
    │   └── PremiumReportWidget.jsx  # React.lazy code-split analytics panel
    ├── mocks/
    │   ├── handlers.js       # MSW request handlers (shared by dev + tests)
    │   ├── browser.js        # MSW browser worker (dev)
    │   └── server.js         # MSW node server (tests)
    └── __tests__/
        ├── EventCard.test.jsx
        └── Calendar.test.jsx
```

## Notes

- No real backend is required — MSW intercepts `fetch('/api/events')` calls
  in both dev and test, so the project runs standalone in VS Code with just
  `npm install && npm run dev`.
- Vitest is used instead of Jest because it drops into a Vite project with
  zero extra config, but it exposes the same `describe/test/expect` globals
  and works with React Testing Library exactly as Jest would.
