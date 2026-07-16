# Medicare Backend — Clean Architecture

A production-minded refactor of the four original Mongoose models:

- User
- Doctor
- Booking
- Review

## Architecture

```text
src/
├── application/       # Use cases / business services
├── config/            # Environment and database configuration
├── domain/            # Domain constants and repository contracts
├── infrastructure/    # Mongoose models and repository implementations
├── interfaces/        # HTTP controllers, routes, middleware and validation
├── shared/            # Cross-cutting errors and helpers
├── app.js
└── server.js
```

The HTTP layer does not access Mongoose directly. Controllers call application
services, and services depend on repository interfaces.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:5000/api/v1/health
```

## API overview

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/doctor/login
GET    /api/v1/doctors
GET    /api/v1/doctors/:id
POST   /api/v1/doctors
PATCH  /api/v1/doctors/:id/approval
POST   /api/v1/bookings
GET    /api/v1/bookings/me
PATCH  /api/v1/bookings/:id/status
POST   /api/v1/reviews
GET    /api/v1/doctors/:doctorId/reviews
```

## Important fixes compared with the source schemas

- `ticketPrice` is a number instead of a string.
- Phone numbers are strings because they may contain `+`, spaces, and leading zeroes.
- Booking references consistently use `Booking`, not an undefined `Appointment`.
- Passwords are hashed and excluded from normal queries.
- Public registration cannot assign the admin role.
- Patients and doctors have separate authentication flows.
- Reviews enforce one review per patient per doctor.
- Doctor rating aggregates are updated after review creation.
- Models include timestamps, indexes, enums, and validation.
- Controllers, services, repositories, and database models are separated.
