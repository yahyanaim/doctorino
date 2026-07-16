# Architecture decisions

## Dependency direction

```text
interfaces -> application -> domain
infrastructure -> domain
```

The composition root in `src/container.js` wires concrete Mongoose repositories
into application services.

## Domain boundaries

### User
Patient/admin identity and authentication.

### Doctor
Doctor profile, approval lifecycle, schedule, fee, and rating aggregate.

### Booking
Appointment reservation. The booking stores a snapshot of `ticketPrice` so
later doctor-price changes do not rewrite historical bookings.

### Review
A verified review belongs to a completed booking. Only one review per
patient/doctor pair is permitted.

## Why booking references replace appointment arrays

The source models used `appointments` referencing an `Appointment` model that
was not present in the supplied repository folder. This refactor uses the
existing `Booking` concept as the appointment aggregate and queries bookings
instead of maintaining duplicated arrays on users and doctors.
