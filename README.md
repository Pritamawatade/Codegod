# Codegod

Codegod is a full-stack, LeetCode-style online judge and coding practice platform built and maintained by [Pritam Awatade](https://github.com/Pritamawatade).

The platform reached **200+ active users within the first week of launch**, validating both product demand and infrastructure stability under real-world load.

Live product: [https://www.codegod.com](https://www.codegod.com)

## Overview

Codegod allows users to solve curated programming problems in the browser, execute code against hidden test cases in isolated sandboxes, track daily streaks and progress, compete via leaderboards, create playlists, participate in per-problem discussions, and purchase premium DSA sheets.

The repository is a monorepo with two independently deployable applications:

- `frontend/` — React single-page application
- `backend/` — Express REST API with Prisma and PostgreSQL

## Key Capabilities

- Problem catalog with difficulty levels, tags, company tags, hints, examples, constraints, editorials, and reference solutions
- In-browser code execution and submission evaluation across 13 languages
- Detailed per-test-case results including stdout, stderr, compile output, time, and memory
- Submission history and solved-problem tracking per user
- Daily streak tracking with calendar and contribution heatmap visualization
- User playlists (public and private) and curated DSA sheets
- Discussion threads, comments, and likes scoped to problems
- Problem feedback (like/dislike) and user statistics dashboard
- Authentication via email/password with verification, plus Google OAuth 2.0
- Role-based administration for problem creation, user management, and content moderation
- Monetized premium sheets via Razorpay order creation and signature verification
- Profile management with Cloudinary-hosted avatars
- Transactional email for verification and notifications

## System Architecture

```text
Client (React + Vite SPA)
  |
  | HTTPS / REST + cookies (JWT)
  v
Backend API (Node.js + Express)
  |-- Prisma ORM --> PostgreSQL (primary datastore)
  |-- Judge0 client --> Judge0 CE (sandboxed execution) --> Redis + Judge0 Postgres
  |-- Razorpay SDK --> Razorpay (payments)
  |-- Cloudinary SDK --> Cloudinary (media)
  |-- Nodemailer + Mailgen --> SMTP / Mailtrap (email)
```

The backend is stateless and horizontally scalable. Execution state lives in Judge0 and Redis, persistent domain state lives in PostgreSQL, and media lives in Cloudinary.

### Request Flow

1. The frontend issues REST requests to `/api/v1/*` using Axios with credentialed cookies.
2. Express middleware handles CORS, JSON parsing, cookie parsing, authentication, and role checks.
3. Controllers implement domain logic and delegate persistence to Prisma.
4. For code execution, the backend normalizes input, Base64-encodes payloads, submits to Judge0, polls for completion, decodes results, applies tolerant output comparison, and persists submissions.

### Code Execution Flow

The execution path is the most complexity-sensitive part of the system:

1. `POST /api/v1/execute-code` handles interactive runs (custom stdin).
2. `POST /api/v1/submission` handles judged submissions against all hidden test cases.
3. Source code and stdin are Base64-encoded per Judge0 requirements.
4. Single submissions use `wait=true` to avoid batch endpoint instability on some Judge0 Community Edition setups.
5. Batch submissions are submitted together and polled until all tokens leave queued/processing states.
6. Judge0 stdout/stderr/compile output are Base64-decoded.
7. Expected vs. actual output comparison is tolerant:
   - CRLF normalization
   - Surrounding whitespace trimming
   - Whitespace collapsing
   - Numeric comparison with epsilon tolerance
   - Boolean-insensitive comparison
   - JSON structural comparison for arrays and objects
8. Results are stored as `Submission` plus per-test `TestCaseResult` rows.
9. On full acceptance, a `ProblemSolved` record is created idempotently and the user's `DailyStreak` is updated.

This design isolates untrusted code in Judge0 workers while keeping judging deterministic and user-friendly.

## Data Model Complexity

PostgreSQL is accessed exclusively through Prisma. The schema contains 14 models with cascading relations:

- `User`, `Problem`, `Submission`, `TestCaseResult`, `ProblemSolved`
- `Playlist`, `ProblemInPlaylist`
- `ProblemFeedback`, `Discussion`, `Comment`, `Like`
- `DailyStreak`, `UserProgress`
- `DsaSheet`, `UserPurchasedSheet`, `Payment`

Notable modeling decisions:

- Unique constraints prevent duplicate problem solves, duplicate feedback, duplicate likes, duplicate playlist entries, and duplicate daily streak entries.
- Cascading deletes preserve referential integrity when problems or users are removed.
- Problems support JSON columns for examples, test cases, code snippets, and reference solutions to accommodate heterogeneous language templates without schema churn.
- Payments are stored with Razorpay payment ID, order ID, and signature for auditability.

## Technology Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4, daisyUI 5 |
| Code editor | Monaco Editor, @monaco-editor/react |
| State management | Zustand 5 |
| Forms and validation | React Hook Form, Zod, @hookform/resolvers |
| HTTP client | Axios |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React, React Icons |
| Notifications | React Hot Toast |
| Authentication | @react-oauth/google |
| Deployment | Vercel (`frontend/vercel.json`) |

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL 15 |
| Code execution | Self-hosted Judge0 CE 1.13.1 |
| Execution dependencies | Redis 6, dedicated Judge0 PostgreSQL 13 |
| Authentication | JSON Web Tokens (short-lived access token + rotating refresh token), Passport.js, passport-google-oauth20, google-auth-library, bcryptjs |
| Payments | Razorpay SDK with HMAC signature verification |
| File uploads and media | Multer, Cloudinary SDK |
| Email | Nodemailer, Mailgen, Mailtrap SMTP |
| Middleware | CORS, cookie-parser, express-session, custom auth and sheet-access middleware |
| Configuration | dotenv with startup environment sanitization (`sanitize-env.js`) |
| Containerization | Docker, Docker Compose |
| Process management | Nodemon (development), Node (production) |

### Infrastructure and DevOps

- Docker Compose orchestrates six services: `backend`, `postgres`, `judge0`, `worker`, `judge0-db`, and `redis`.
- Prisma migrations run automatically in the backend entrypoint via `prisma migrate deploy`.
- Health checks are exposed at `GET /healthcheck` and wired into Compose.
- Host port defaults to 5433 for the app database to avoid collision with a locally installed PostgreSQL on 5432.
- Backend trusts proxy headers for correct secure-cookie behavior behind Nginx, Cloudflare, Render, or similar.

## API Surface

Base path: `/api/v1`

| Prefix | Domain |
|---|---|
| `/users` | Registration, login, OAuth, email verification, profile, stats |
| `/problems` | CRUD, listing, feedback |
| `/execute-code` | Interactive code runs |
| `/submission` | Judged submissions and history |
| `/playlists` | User playlists and playlist problems |
| `/streak` | Daily streak records |
| `/discussion` | Problem discussions, comments, likes |
| `/payments` | Razorpay order creation and verification |
| `/sheets` | DSA sheets, purchase gating, progress |

Authentication uses HttpOnly cookies for access and refresh tokens. Admin-only routes are guarded by role checks.

## Local Development

### Prerequisites

- Node.js 18 or later
- pnpm or npm
- PostgreSQL (local or via Docker)
- Docker and Docker Compose (required for full Judge0 execution)

### 1. Clone the repository

```bash
git clone https://github.com/Pritamawatade/Codegod.git
cd Codegod
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with database credentials, JWT secrets, Judge0 URL, Cloudinary credentials, SMTP credentials, Google OAuth credentials, and Razorpay keys. See `backend/DOCKER_README.md` for the complete variable reference.

### 3. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4. Apply database migrations

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

Default: `http://localhost:8080`

### 6. Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Default: `http://localhost:5173`

Both servers must be running for full functionality.

## Docker Deployment (Recommended for Execution)

The full stack, including sandboxed code execution, runs through Compose:

```bash
cd backend
docker compose up --build
```

Detached mode:

```bash
docker compose up -d --build
```

Verify health:

```bash
curl http://localhost:8080/healthcheck
```

Apply migrations manually after pulling new schema changes:

```bash
docker compose exec backend pnpm prisma migrate deploy
```

Stop services:

```bash
docker compose down
```

Detailed Docker, environment, and troubleshooting documentation is available in `backend/DOCKER_README.md`.

## Project Structure

```text
Codegod/
  backend/
    prisma/
      schema.prisma
      migrations/
    src/
      controllers/
      routes/
      middlewares/
      libs/        # Prisma client, Judge0 client
      utils/       # API response/error, tokens, mail, payments, uploads
      passport.js
      index.js
    Dockerfile
    docker-compose.yml
    DOCKER_README.md
  frontend/
    src/
      pages/
      components/
      layout/
      store/       # Zustand auth/theme stores
      lib/
    vite.config.js
    vercel.json
```

## Engineering Challenges Addressed

- **Untrusted code isolation:** execution runs in privileged Judge0 workers separate from the API and primary database.
- **Judge0 reliability:** single-submission `wait=true` path avoids batch endpoint internal errors observed on some Community Edition deployments; batch path uses explicit polling with backoff.
- **Output comparison robustness:** prevents false negatives from trailing newlines, CRLF differences, spacing, numeric formatting, boolean casing, and JSON key spacing.
- **Multi-database operations:** the API database and Judge0 database are independent Postgres instances with separate lifecycles.
- **Authentication hardening:** short-lived access tokens, refresh-token rotation, HttpOnly cookies, proxy-aware secure cookie handling, and OAuth account linking.
- **Monetization integrity:** Razorpay signature verification before granting sheet access; purchase checks enforced by middleware.
- **Operational repeatability:** containerized setup with automatic migrations and health checks reduces environment drift between development and production.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a pull request with a clear description and testing notes.

For bugs, include reproduction steps, expected behavior, request/response samples where applicable, and environment details.

## License

This project is distributed under the MIT License. See `LICENSE` for details.

## Maintainer

Maintained by [Pritam Awatade](https://github.com/Pritamawatade).
