# IV1201 Recruitment Application

A web-based recruitment system for an amusement park, built with a microservices architecture. Applicants can register, submit their competence profiles and availability periods, and recruiters can review and manage applications.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| API Gateway | Spring Cloud Gateway (Java 21) |
| Backend Services | Spring Boot 3.2 (Java 21) |
| Databases | PostgreSQL 15 (one per service) |
| Authentication | JWT (HS256) with Spring Security + BCrypt |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 |

## Architecture Overview

```
                        ┌──────────────┐
                        │   Frontend   │
                        │  (React SPA) │
                        │  Port 3000   │
                        └──────┬───────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │   API Gateway   │
                      │   Port 8080     │
                      │  (JWT filter)   │
                      └───┬─────────┬───┘
                          │         │
              ┌───────────▼──┐  ┌───▼──────────────┐
              │ Auth Service │  │Recruitment Service│
              │ (internal)   │──│   (internal)      │
              └──────┬───────┘  └────────┬──────────┘
                     │                   │
              ┌──────▼───────┐  ┌────────▼──────────┐
              │   auth_db    │  │  recruitment_db    │
              │  Port 5432   │  │    Port 5433       │
              └──────────────┘  └───────────────────┘
```

The **API Gateway** is the single entry point for all frontend requests. It routes traffic to the appropriate backend service and applies JWT authentication on protected routes. The auth service and recruitment service each own their own PostgreSQL database.

### Inter-Service Communication

During user registration, the **auth service** calls the **recruitment service** internally (via REST) to create a corresponding person record. This follows a **saga pattern** with a compensating transaction: if the recruitment service call fails, the auth service rolls back the user creation.

## Prerequisites

- **Docker** and **Docker Compose** (for running the full stack)
- **Node.js 20+** and **npm** (for frontend development without Docker)
- **Java 21** and **Maven 3.9+** (for backend development without Docker)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd iv1201-recruitment-app
```

### 2. Configure environment variables

Create a `.env` file in the project root (or edit the existing one):

```env
DB_USER=postgres
DB_PASSWORD=<your-db-password>
AUTH_DB_HOST=auth-db
AUTH_DB_PORT=5432
AUTH_DB_NAME=auth_db
RECRUIT_DB_HOST=recruitment-db
RECRUIT_DB_PORT=5432
RECRUIT_DB_NAME=recruitment_db
JWT_SECRET=<base64-encoded-secret-key>
RECRUITER_SECRET_CODE=<secret-code-for-recruiter-registration>
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:8080
```

### 3. Start all services

```bash
docker compose up --build
```

This starts all six containers: two PostgreSQL databases, auth service, recruitment service, API gateway, and frontend dev server.

### 4. Verify

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Auth DB | localhost:5432 |
| Recruitment DB | localhost:5433 |

The databases are automatically initialized with seed data from the SQL files in each service's `src/main/resources/` directory.

## Environment Variables

| Variable | Description | Used By |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | Both databases |
| `DB_PASSWORD` | PostgreSQL password | Both databases |
| `AUTH_DB_HOST` | Auth database hostname | Auth service |
| `AUTH_DB_PORT` | Auth database port | Auth service |
| `AUTH_DB_NAME` | Auth database name | Auth service |
| `RECRUIT_DB_HOST` | Recruitment database hostname | Recruitment service |
| `RECRUIT_DB_PORT` | Recruitment database port | Recruitment service |
| `RECRUIT_DB_NAME` | Recruitment database name | Recruitment service |
| `JWT_SECRET` | Base64-encoded key for signing/verifying JWTs | Auth service, API gateway |
| `RECRUITER_SECRET_CODE` | Secret code required for recruiter registration | Auth service |
| `FRONTEND_URL` | Frontend origin URL (used for CORS) | API gateway |
| `VITE_API_URL` | API gateway URL the frontend calls | Frontend |

## Services

### API Gateway (`api-gateway-service/`)

Spring Cloud Gateway that routes all frontend requests to the correct backend service. Handles CORS and JWT authentication.

**Route table:**

| Route Pattern | Target | Auth Required |
|---------------|--------|:------------:|
| `/auth/**` | Auth service | No |
| `/api/recruitment/competences/**` | Recruitment service | No |
| `/api/recruitment/migrated-user` | Recruitment service | No |
| `/api/recruitment/applications/**` | Recruitment service | Yes |
| `/api/recruitment/**` | Recruitment service | Yes |

For protected routes, the gateway's `JwtAuthenticationFilter` validates the `Authorization: Bearer <token>` header, extracts the user ID from the JWT `id` claim, and forwards it as an `X-User-ID` header to the downstream service.

**Key files:**
- `config/RouteConfig.java` — Route definitions
- `config/CorsConfig.java` — CORS configuration (allowed origins from `APP_FRONTEND_URL`)
- `filter/JwtAuthenticationFilter.java` — JWT validation and header injection

---

### Auth Service (`auth-service/`)

Handles user registration (applicant and recruiter), login, and JWT token generation.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register an applicant (username, password, email, pnr) |
| POST | `/auth/register/recruiter` | Register a recruiter (requires secret code) |
| POST | `/auth/login` | Login and receive a JWT token |

**Registration saga:** When a new user registers, the auth service:
1. Creates a user record in `auth_db` (with BCrypt-hashed password)
2. Calls the recruitment service's internal endpoint (`POST /api/recruitment/persons`) to create a corresponding person record
3. If step 2 fails, deletes the user created in step 1 (compensating transaction)

**JWT tokens:** Signed with HS256, expire after 10 hours. The token payload contains `id` (user ID) and `role` (role ID where 1 = recruiter, 2 = applicant).

**Custom validators:**
- `@UniqueUsername` — Rejects registration if username already exists
- `@ValidSecretCode` — Validates recruiter registration code against the `RECRUITER_SECRET_CODE` env var

**Key files:**
- `controller/AuthController.java` — REST endpoints
- `service/AuthService.java` — Registration saga, login logic
- `util/JwtUtil.java` — Token generation and validation
- `config/SecurityConfig.java` — Spring Security setup
- `resources/auth-db.sql` — Database initialization with seed data

---

### Recruitment Service (`recruitment-service/`)

Core business logic for managing job applications, competences, and availability periods.

**Endpoints:**

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/recruitment/applications` | Submit an application (competences + availability) | Yes (X-User-ID) |
| GET | `/api/recruitment/applications` | List all applications (summary view) | Yes |
| GET | `/api/recruitment/applications/{id}` | Get full application details | Yes |
| PUT | `/api/recruitment/applications/{id}/status` | Update application status (accept/reject) | Yes |
| POST | `/api/recruitment/persons` | Create person record (internal, called by auth-service) | No |
| GET | `/api/recruitment/competences` | List available competences | No |
| GET | `/api/recruitment/availabilities` | List all availability periods | No |
| PUT | `/api/recruitment/profile` | Update user profile (email, pnr) for migrated users | Yes (X-User-ID) |
| POST | `/api/recruitment/migrated-user` | Handle migrated user password reset | No |
| GET | `/api/recruitment/applications/me` | Get the current users application details | Yes (X-User-ID) |
| PUT | `/api/recruitment/applications/me` | Update the current users application | Yes (X-User-ID) |

**Optimistic locking:** Application status updates use a `version` field. The client must send the expected version; if it doesn't match (another recruiter updated it), the service returns `409 Conflict`.

**Application statuses:** `UNHANDLED` (default), `ACCEPTED`, `REJECTED`

**Key files:**
- `controller/ApplicationController.java` — Application CRUD endpoints
- `controller/PersonController.java` — Internal person creation endpoint
- `controller/CompetenceController.java` — Competence listing
- `controller/MigrationController.java` — Legacy user password reset
- `service/ApplicationService.java` — Business logic with optimistic locking
- `resources/recruitment-db.sql` — Database initialization with seed data

---

### Frontend Service (`frontend-service/`)

React 19 single-page application with TypeScript, Vite, and i18n support (English/Swedish). Uses a feature-based folder structure with the MVP/Presenter pattern.

See [frontend-service/README.md](frontend-service/README.md) for detailed frontend documentation.

## Database Schema

### Auth Database (`auth_db`)

```
person
├── person_id   BIGINT (PK)
├── username    VARCHAR(255)
├── password    VARCHAR(255)  -- BCrypt hashed
└── role_id     BIGINT        -- 1 = recruiter, 2 = applicant
```

### Recruitment Database (`recruitment_db`)

```
person
├── person_id   BIGINT (PK)       -- Matches auth_db person_id
├── name        VARCHAR(255)
├── surname     VARCHAR(255)
├── pnr         VARCHAR(255)       -- Swedish personal number
├── email       VARCHAR(255)
├── status      VARCHAR(255)       -- UNHANDLED / ACCEPTED / REJECTED
└── version     BIGINT DEFAULT 0   -- Optimistic locking

competence
├── competence_id   INTEGER (PK)
└── name            VARCHAR(255)

competence_profile
├── competence_profile_id   INTEGER (PK)
├── person_id               BIGINT (FK → person)
├── competence_id           INTEGER (FK → competence)
└── years_of_experience     NUMERIC(4,2)

availability
├── availability_id   INTEGER (PK)
├── person_id         BIGINT (FK → person)
├── from_date         DATE
└── to_date           DATE

role
├── role_id   INTEGER (PK)
└── name      VARCHAR(255)
```

The `person_id` in the recruitment database is set to match the `person_id` in the auth database, established during the registration saga.

## Deployment

### Local Development

```bash
# Full stack via Docker
docker compose up --build

# Frontend only (outside Docker)
cd frontend-service
npm install
npm run dev

# Backend service (outside Docker, requires running databases)
cd auth-service
mvn spring-boot:run
```

When running services outside Docker, update the database connection properties in each service's `application.properties` to point to `localhost` instead of the Docker hostnames.

### CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/ci-cd-pipeline.yml`) runs on every push and PR to `main`:

1. **Frontend CI** — Installs dependencies, runs ESLint, runs Vitest with coverage
2. **Backend CI** — Runs Maven tests, JaCoCo coverage, and Checkstyle for all three Java services
3. **Publish Reports** (main only) — Aggregates coverage reports and deploys to GitHub Pages
4. **Deploy** (main only) — SSHs into the EC2 instance, pulls latest code, rebuilds all containers

**Required GitHub Secrets for deployment:**
- `EC2_HOST` — EC2 instance hostname
- `EC2_USER` — SSH username
- `EC2_SSH_KEY` — SSH private key

### Production Deployment

The application is deployed on an **AWS EC2** instance. On push to `main`, the CI/CD pipeline:

1. Waits for all tests to pass
2. SSHs into the EC2 instance
3. Runs `git pull origin main`
4. Runs `docker compose down && docker compose up -d --build`
5. Performs a health check on the frontend (polls port 3000 for up to 200 seconds)

## Testing

### Backend

```bash
# Run tests for a specific service
cd auth-service && mvn test
cd recruitment-service && mvn test
cd api-gateway-service && mvn test

# Run tests with coverage and linting
cd auth-service && mvn test jacoco:report checkstyle:check
```

Backend tests use JUnit with Spring Boot Test and an H2 in-memory database. Coverage reports are generated by JaCoCo.

### Frontend

```bash
cd frontend-service

# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage
```

Frontend tests use Vitest with React Testing Library. See [frontend-service/README.md](frontend-service/README.md) for details on testing patterns.

## Project Structure

```
iv1201-recruitment-app/
├── .github/workflows/
│   └── ci-cd-pipeline.yml          # GitHub Actions CI/CD
├── api-gateway-service/             # Spring Cloud Gateway
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/.../gateway/
│       ├── config/                  # Route and CORS config
│       └── filter/                  # JWT authentication filter
├── auth-service/                    # Authentication microservice
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/java/.../auth/
│       │   ├── controller/          # REST endpoints
│       │   ├── service/             # Business logic (registration saga)
│       │   ├── model/               # User entity
│       │   ├── integration/         # JPA repositories
│       │   ├── util/                # JWT utility
│       │   ├── config/              # Security config
│       │   └── validation/          # Custom validators
│       └── main/resources/
│           ├── application.properties
│           └── auth-db.sql          # DB init script with seed data
├── recruitment-service/             # Core recruitment microservice
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/java/.../recruitment/
│       │   ├── controller/          # REST endpoints
│       │   ├── service/             # Business logic (optimistic locking)
│       │   ├── model/               # JPA entities
│       │   ├── repository/          # JPA repositories
│       │   └── dto/                 # Data transfer objects
│       └── main/resources/
│           ├── application.properties
│           └── recruitment-db.sql   # DB init script with seed data
├── frontend-service/                # React SPA
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── features/                # Feature modules (auth, application, etc.)
│       ├── components/              # Shared components
│       ├── utils/                   # Validation schemas
│       └── locales/                 # i18n translations (en, sv)
├── docker-compose.yml               # Local development orchestration
├── .env                             # Environment variables
└── README.md                        # This file
```
