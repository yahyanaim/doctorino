# Doctorino

Plateforme marocaine de prise de rendez-vous médicaux en ligne.

## Stack

**Frontend** — React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
**Backend** — Express 5 + TypeScript + Mongoose + Clean Architecture

## Prerequisites

- Node.js >= 20
- MongoDB (running on `mongodb://127.0.0.1:27017`)
- A `.env` file — copy from `backend/.env.example` and adjust

## Setup

```bash
# Backend
cd backend
cp .env.example .env    # edit JWT_SECRET, PORT, etc.
npm install
npm run dev             # http://localhost:5001

# Frontend (separate terminal)
cd frontend
npm install
npm run dev             # http://localhost:5173
```

## Environment Variables (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend port (Doctorino uses `5001`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/medicare` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

## Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | ESLint |
| `npm test` | Run tests (`node --test`) |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run typecheck` | Type-check only |
| `npm run lint` | ESLint |

## Architecture

### Backend (clean architecture)

```
backend/src/
├── domain/          # Entities, constants, repository interfaces
├── application/     # Services (business logic)
├── infrastructure/  # Mongoose models + repository implementations
├── interfaces/      # HTTP controllers, routes, middleware
├── shared/          # Errors, utilities
├── config/          # env, database
├── container.ts     # DI wiring
├── app.ts           # Express app
└── server.ts        # Entry point
```

### Frontend

```
frontend/src/
├── api/             # HTTP client + endpoint functions
├── components/
│   ├── ui/          # shadcn/ui primitives (Button, Card, Input, etc.)
│   ├── Header/      # Navigation bar
│   └── Footer/      # Site footer
├── context/         # AuthContext (JWT + user state)
├── hooks/           # useAuth
├── layout/          # App shell (Header + Routes + Footer)
├── pages/           # Route-level components
│   ├── admin/       # Admin-only pages
│   └── Doctors/     # Doctor listing + detail
└── routes/          # React Router config
```

## API Endpoints

All under `http://localhost:5001/api/v1`.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register a patient |
| POST | `/auth/login` | Patient login |
| POST | `/auth/doctor/login` | Doctor login |

### Doctors
| Method | Path | Description |
|--------|------|-------------|
| GET | `/doctors` | List approved doctors (`?search=&specialization=&page=&limit=`) |
| GET | `/doctors/:id` | Get doctor by ID |
| POST | `/doctors` | [Admin] Create a doctor |
| PATCH | `/doctors/:id/approval` | [Admin] Approve/reject a doctor |
| GET | `/doctors/:id/reviews` | List reviews for a doctor |

### Bookings
| Method | Path | Description |
|--------|------|-------------|
| POST | `/bookings` | [Auth] Create a booking |
| GET | `/bookings/me` | [Auth] List my bookings |
| PATCH | `/bookings/:id/status` | [Admin] Update booking status |

### Reviews
| Method | Path | Description |
|--------|------|-------------|
| POST | `/reviews` | [Auth] Create a review (completed booking) |

## Domain Constants

### User Roles
- `patient` — default on signup
- `admin`

### Doctor Approval States
- `pending` → admin must approve before listing
- `approved` → visible to patients
- `rejected`

### Booking States
- `pending` → `approved` / `cancelled`
- `approved` → `completed` / `cancelled`
- `cancelled`, `completed` — terminal

## Database

Four Mongoose collections:

- **User** — patient accounts
- **Doctor** — doctor accounts (separate from User)
- **Booking** — appointments with status machine
- **Review** — patient feedback on completed bookings
