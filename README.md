# SkillBridge Backend 🎓

**SkillBridge** is a full-stack tutoring platform where students can discover expert tutors, book lesson slots, and pay securely via Stripe. This repository contains the **backend REST API** powering the platform.

🔗 **Live API:** [https://skillbridge-backend-phi.vercel.app](https://skillbridge-backend-phi.vercel.app)
🔗 **Frontend Repo:** [skillbridge-frontend](https://github.com/Rezwan66/skillbridge-frontend/tree/dev-a5)

---

## 🛠️ Tech Stack

| Layer          | Technology                                                      |
| -------------- | --------------------------------------------------------------- |
| Runtime        | Node.js (v20+)                                                  |
| Framework      | Express.js v5                                                   |
| Language       | TypeScript                                                      |
| Database       | PostgreSQL                                                      |
| ORM            | Prisma v7 (multi-schema)                                        |
| Authentication | Better Auth (session-based with cookie tokens)                  |
| Payments       | Stripe (Checkout Sessions + Webhooks)                           |
| Validation     | Zod v4                                                          |
| Deployment     | Vercel (Serverless)                                             |

---

## 📐 System Architecture

### System Design

![System Design](skillbridge-system-design.png)

### Entity Relationship Diagram

![ER Diagram](SkillBridge_ER.drawio.png)

---

## ✨ Key Features

- **Role-Based Access Control** — Three distinct roles: `STUDENT`, `TUTOR`, and `ADMIN`, each with scoped permissions.
- **Tutor Discovery** — Search, filter by category, rating, and hourly rate with full-text search across name, bio, and categories.
- **Availability Management** — Tutors create time slots; students book them. Slots are atomically marked as booked.
- **Booking Lifecycle** — Full status flow: `CONFIRMED` → `COMPLETED` / `CANCELLED` with server-side validation (e.g., cannot complete before end time).
- **Stripe Payment Integration** — Checkout sessions with EUR currency. Webhook listener auto-updates payment status on success.
- **Review System** — Students rate tutors post-session with star ratings and written reviews.
- **Admin Dashboard** — Manage users, tutors, categories, and platform-wide data.

---

## 📁 Project Structure

```
src/
├── app.ts                  # Express app configuration, middleware, routes
├── server.ts               # HTTP server entry point
├── index.ts                # Vercel serverless entry
├── errors/                 # Custom AppError class
├── helpers/                # Utility helpers (catchAsync, sendResponse)
├── lib/                    # Prisma client, Better Auth, Stripe config
├── middlewares/            # Auth guard, global error handler
├── scripts/                # Database seed scripts (admin seeding)
└── modules/
    ├── admin/              # Admin management (route, controller, service)
    ├── bookings/           # Booking CRUD + payment initiation
    ├── categories/         # Teaching category management
    ├── payments/           # Stripe webhook handler
    ├── reviews/            # Student review system
    ├── tutors/             # Tutor profiles, search, availability
    └── users/              # User profile management
```

---

## 🔌 API Endpoints

### 🔐 Authentication (Better Auth)

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| POST   | `/api/auth/sign-up/email`        | Register a new user    |
| POST   | `/api/auth/sign-in/email`        | Login with credentials |
| GET    | `/api/auth/get-session`          | Get current session    |

### 👤 Users

| Method | Endpoint               | Access  | Description               |
| ------ | ---------------------- | ------- | ------------------------- |
| GET    | `/api/users/me`        | Auth    | Get current user profile  |
| PATCH  | `/api/users/me`        | Auth    | Update user profile       |

### 🎓 Tutors

| Method | Endpoint                         | Access  | Description                          |
| ------ | -------------------------------- | ------- | ------------------------------------ |
| GET    | `/api/tutors`                    | Public  | List all tutors (with filters)       |
| GET    | `/api/tutors/:id`                | Public  | Get tutor profile by ID              |
| POST   | `/api/tutors`                    | Tutor   | Create tutor profile                 |
| PATCH  | `/api/tutors`                    | Tutor   | Update tutor profile                 |
| POST   | `/api/tutors/availability`       | Tutor   | Create availability slot             |
| DELETE | `/api/tutors/availability/:id`   | Tutor   | Delete availability slot             |

### 📅 Bookings

| Method | Endpoint                              | Access  | Description                      |
| ------ | ------------------------------------- | ------- | -------------------------------- |
| GET    | `/api/bookings`                       | Auth    | Get user's bookings              |
| POST   | `/api/bookings`                       | Student | Create a booking                 |
| PATCH  | `/api/bookings/:id/status`            | Tutor   | Complete or cancel a booking     |
| POST   | `/api/bookings/initiate-payment/:id`  | Student | Create Stripe checkout session   |

### 💳 Payments

| Method | Endpoint                  | Access  | Description                     |
| ------ | ------------------------- | ------- | ------------------------------- |
| POST   | `/api/payments/webhook`   | Stripe  | Handle Stripe webhook events    |

### ⭐ Reviews

| Method | Endpoint            | Access  | Description              |
| ------ | ------------------- | ------- | ------------------------ |
| GET    | `/api/reviews`      | Public  | Get all reviews          |
| POST   | `/api/reviews`      | Student | Create a review          |

### 📂 Categories

| Method | Endpoint             | Access  | Description              |
| ------ | -------------------- | ------- | ------------------------ |
| GET    | `/api/categories`    | Public  | List all categories      |
| POST   | `/api/categories`    | Admin   | Create a category        |

### 🛡️ Admin

| Method | Endpoint                  | Access | Description              |
| ------ | ------------------------- | ------ | ------------------------ |
| GET    | `/api/admin/users`        | Admin  | Get all platform users   |
| PATCH  | `/api/admin/users/:id`    | Admin  | Update user (ban, role)  |

---

## ✅ Getting Started

Follow these steps to set up and run the backend server locally.

### Prerequisites

- Node.js v20+
- PostgreSQL database
- Stripe account (for payment features)

### 1. Clone & Install

```bash
git clone https://github.com/Rezwan66/skillbridge-backend.git
cd skillbridge-backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge?schema=public"

# Server
PORT=5000

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000

# Frontend URL (CORS)
APP_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Database Setup

```bash
# Generate Prisma client types
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed admin user
npm run seed:admin

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 4. Run the Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 🧪 Useful Commands

| Command                              | Description                                |
| ------------------------------------ | ------------------------------------------ |
| `npm run dev`                        | Start development server with hot reload   |
| `npm run build`                      | Build for Vercel deployment                |
| `npm run seed:admin`                 | Seed the admin user                        |
| `npx prisma generate`               | Regenerate Prisma client types             |
| `npx prisma migrate dev`            | Apply schema migrations                    |
| `npx prisma studio`                 | Open Prisma Studio GUI                     |
| `npx @better-auth/cli generate`     | Regenerate Better Auth user models         |

---

## 🔒 Error Handling

The API uses a centralized global error handler that returns consistent error responses:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errorSource": [
    {
      "path": "fieldName",
      "message": "Specific validation error"
    }
  ]
}
```

Handled error types: `ZodError`, `PrismaClientKnownRequestError`, `PrismaClientValidationError`, `AppError`, and generic `Error`.

---

<!-- ## 📄 License

This project is part of the **Programming Hero** Level 2 Web Development course — Mission 5, Assignment 5. -->
