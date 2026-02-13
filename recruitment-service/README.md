# Recruitment Service

Core microservice for the IV1201 Recruitment Application. Manages applicant profiles, competence profiles, availability periods, and application status decisions.

## Tech Stack

- Java 21, Spring Boot 3.2
- Spring Data JPA with Hibernate
- PostgreSQL 15 (`recruitment_db`)

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/recruitment/applications` | Submit an application (competences + availability) | Yes (X-User-ID) |
| GET | `/api/recruitment/applications` | List all applications (summary view) | Yes |
| GET | `/api/recruitment/applications/{id}` | Get full application details | Yes |
| PUT | `/api/recruitment/applications/{id}/status` | Update application status (accept/reject) | Yes |
| POST | `/api/recruitment/persons` | Create person record (internal, called by auth-service) | No |
| GET | `/api/recruitment/competences` | List available competences | No |
| GET | `/api/recruitment/availabilities` | List all availability periods | No |
| POST | `/api/recruitment/migrated-user` | Handle migrated user password reset | No |

Authentication is handled by the API Gateway, which validates the JWT and forwards `X-User-ID` as a header.

## Data Model

**Person** (`person` table)
- `id` (Long, primary key — matches auth-service user id)
- `name`, `surname`, `email`, `pnr` (String)
- `status` (String — UNHANDLED, ACCEPTED, or REJECTED)
- `version` (Long, `@Version` — used for optimistic locking)

**Competence** (`competence` table)
- `competenceId` (Long, auto-generated)
- `name` (String — e.g., "ticket sales", "lotteries")

**CompetenceProfile** (`competence_profile` table)
- `id` (Long, auto-generated)
- `person` (ManyToOne → Person)
- `competence` (ManyToOne → Competence)
- `yearsOfExperience` (BigDecimal)

**Availability** (`availability` table)
- `id` (Long, auto-generated)
- `person` (ManyToOne → Person)
- `fromDate`, `toDate` (LocalDate)

## Transaction Strategy

All public methods in `ApplicationService` run inside a transaction, declared via the class-level annotation:

```java
@Service
@Transactional
public class ApplicationService { ... }
```

Spring creates a proxy around the service. When any public method is called from outside the class, the proxy opens a database transaction before the method body executes and commits it when the method returns normally. If an unchecked exception (`RuntimeException` or its subclasses) is thrown, the transaction is rolled back instead.

### createApplication() — Multi-Table Atomic Write

This is the most critical transaction in the system. Submitting an application requires writing to **three tables** in a single atomic operation:

1. **Transaction begins** when the method is called (via Spring's transactional proxy).
2. The `person` record is saved or updated (INSERT or UPDATE into `person`).
3. Each competence is iterated: for every competence the applicant selected, a `competence_profile` row is inserted (INSERT into `competence_profile`).
4. Each availability period is iterated: for every period the applicant specified, an `availability` row is inserted (INSERT into `availability`).
5. **If all inserts succeed**, the method returns and the transaction **commits** — all rows are persisted atomically.
6. **If any insert fails** (e.g., a referenced competence does not exist, throwing `RuntimeException`), the transaction **rolls back** — none of the rows are persisted.

**Why a transaction is essential:** Without a transaction, a failure partway through (say, after saving 2 of 3 competences but before saving availability periods) would leave **inconsistent data** in the database: a partially saved application with some competences but no availability periods. The recruiter reviewing this application would see incomplete information and could make a wrong decision. The transaction guarantees all-or-nothing: the application is either fully saved or not saved at all.

### createPerson() — Registration Saga Participant

1. **Transaction begins** on method entry.
2. A new `person` row is inserted with `id`, `email`, `pnr`, and status `UNHANDLED`.
3. **Transaction commits** on return.

This method is called by the auth-service during user registration as part of a **saga pattern**. If this call fails, the auth-service executes a compensating transaction (deleting the user from `auth_db`). See the auth-service README for the full saga flow.

**Why a transaction is needed:** Although this is a single insert, the transaction ensures the write is atomic and durable. If the database connection drops mid-write, the transaction rolls back cleanly rather than leaving a partially written row.

### updateApplicationStatus() — Optimistic Locking

1. **Transaction begins** on method entry.
2. The `person` is loaded from the database (SELECT).
3. The client-provided `expectedVersion` is compared against the current `version` in the database. If they differ, another recruiter has already modified this application — a `409 Conflict` is thrown and the transaction **rolls back**.
4. The `status` field is updated and saved. Hibernate automatically increments the `version` column (via `@Version` annotation).
5. If another concurrent transaction committed a version change between our SELECT and the save, Hibernate throws `ObjectOptimisticLockingFailureException`, which is caught and re-thrown as `409 Conflict`.
6. **Transaction commits** on successful return.

**Why a transaction is needed:** This is a **read-modify-write** operation. The transaction ensures that the version check and the status update happen atomically — no other transaction can modify the person between our read and write. Combined with optimistic locking, this prevents lost updates when two recruiters try to change an application's status simultaneously.

### getAllApplications() / getApplicationById() — Read Operations

1. **Transaction begins** on method entry.
2. Data is read from `person`, `competence_profile`, and `availability` tables.
3. **Transaction commits** on return.

**Why a transaction is needed:** These methods perform multiple SELECT queries (person + competences + availabilities for `getApplicationById`). The transaction ensures all reads see a **consistent snapshot** of the database (PostgreSQL's default READ COMMITTED isolation level). Without a transaction, a concurrent `createApplication()` could commit between our reads, causing us to see a person record but not their newly inserted competences.

### emailExists() — Existence Check

1. **Transaction begins** on method entry.
2. A single `SELECT EXISTS` query runs against the `person` table.
3. **Transaction commits** on return.

**Why a transaction is needed:** Provides a consistent read. Used by the migrated-user flow to check if an email is registered before sending password reset instructions.
