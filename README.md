# Junior Frontend Technical Assessment

A responsive React product catalogue dashboard plus the requested vanilla JavaScript logic exercises. The interface supports product search, category/status filters, reusable create/edit forms, read-only details, delete confirmation, loading skeletons, retryable error feedback, and optimistic CRUD updates.

## Setup

Prerequisites: Node.js 20 or newer and npm.

```bash
git clone https://github.com/Mahrozar/frontend-assessment-alamsyah.git
cd frontend-assessment-alamsyah
npm install
cp .env.example .env
npm run dev
```

Update `.env` before starting the app:

```env
VITE_API_URL=https://my-json-server.typicode.com/Mahrozar/frontend-assessment-alamsyah/products
```

### Mock API endpoint

`https://my-json-server.typicode.com/Mahrozar/frontend-assessment-alamsyah/products`

The endpoint becomes available after this repository, including the root `db.json`, is pushed to a public GitHub repository.

## Commands

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run preview  # preview the production build
npm test         # run logic exercise tests
```

## Architecture

```text
.
├── logic-assessment.js          # independently exported vanilla JS solutions
├── logic-assessment.test.js     # edge-case tests using Node's test runner
├── db.json                      # my-json-server seed data
└── src
	├── components               # modal, product form/table, toast, skeleton, icons
	├── hooks/useProducts.js     # server state and optimistic CRUD lifecycle
	├── services/productApi.js   # REST requests and response/error handling
	├── utils/formatters.js      # currency and date formatting
	├── App.jsx                  # filtering and UI flow orchestration
	└── styles.css               # responsive visual system
```

State is kept local with React hooks because the app has one product domain and no deeply shared state. The API boundary lives in a small service module, while `useProducts` owns asynchronous product state. This keeps presentation components focused and avoids adding a state-management dependency that would not provide meaningful value at this scale.

## Decisions and trade-offs

- **Optimistic updates:** Create, edit, and delete update local state immediately. The server response then reconciles the temporary/local record. If the request fails, the previous state is restored and an error toast explains that the change was rolled back.
- **Validation:** One controlled `ProductForm` is used for create and edit. Errors appear after blur or a submit attempt and update as values change. Submission stays disabled while invalid or in flight.
- **Edge cases:** Invalid API responses become an empty list; missing API configuration and failed requests are surfaced without blocking the whole interface. The logic exercises safely handle empty, invalid, and incomplete input without mutating arguments.
- **Responsive layout:** Desktop uses a data table; smaller screens switch to cards so actions and labels remain readable without horizontal scrolling.
- **No pagination:** The brief marks pagination optional. Client-side filtering is enough for the intentionally small mock catalogue.
- **Mock API limitation:** `my-json-server` writes are session-based and can reset. The UI treats the response as reconciliation, but `db.json` remains the durable seed source.

## What I would improve with more time

- Add component and end-to-end tests for CRUD, rollback, keyboard navigation, and filter behavior.
- Add pagination or server-side query parameters for larger catalogues.
- Add focus trapping to the modal and restore focus to the triggering control on close.
- Add abort signals and stale-request protection for slow or overlapping fetches.
- Replace category constants with categories supplied by a dedicated API endpoint.