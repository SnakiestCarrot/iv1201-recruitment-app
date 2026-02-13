# Auth Service

Authentication microservice for the IV1201 Recruitment Application. Handles user registration, login, and JWT token issuance.

## Tech Stack

- Java 21, Spring Boot 3.2
- Spring Data JPA with Hibernate
- PostgreSQL 15 (`auth_db`)
- Spring Security with BCrypt password encoding
- JWT (JJWT library, HS256)

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Register a new applicant | No |
| POST | `/auth/register/recruiter` | Register a new recruiter (requires secret code) | No |
| POST | `/auth/login` | Authenticate and receive JWT | No |

## Data Model

The service owns a single entity:

**User** (`person` table in `auth_db`)
- `id` (Long, auto-generated primary key)
- `username` (String, unique)
- `password` (String, BCrypt-hashed)
- `roleId` (Long — 1 = Recruiter, 2 = Applicant)

## Transaction Strategy

All public methods in `AuthService` run inside a transaction, declared via the class-level annotation:

```java
@Service
@Transactional(rollbackFor = Exception.class)
public class AuthService { ... }
```

The `rollbackFor = Exception.class` ensures that **any** exception (checked or unchecked) triggers a rollback, not just unchecked `RuntimeException` subclasses. This is important because the inter-service HTTP calls via `RestTemplate` can surface checked exception wrappers.

### register() / registerRecruiter() — Saga Pattern

These methods span two independent databases (`auth_db` and `recruitment_db`) which cannot participate in a single ACID transaction. A **saga with compensating transaction** is used instead:

1. **Transaction begins** when Spring's proxy intercepts the method call.
2. The user is saved to `auth_db` and flushed immediately (`userRepository.save()` + `flush()`), making the row visible within the current transaction.
3. An HTTP POST is sent to the recruitment service to create the matching `person` record in `recruitment_db`.
4. **If the remote call succeeds**, the method returns and the transaction **commits** — the user row in `auth_db` is persisted permanently.
5. **If the remote call fails**, the catch block executes a **compensating transaction**: the user is deleted from `auth_db` (`userRepository.delete()` + `flush()`), and a `RuntimeException` is thrown which causes the transaction to **roll back**.

**Why a transaction is needed:** Without it, a failure during the remote call could leave an orphaned user in `auth_db` with no corresponding person in `recruitment_db`. The user would be able to log in but would have no profile, causing errors throughout the application. The saga pattern ensures that either both records exist or neither does.

### login()

1. **Transaction begins** on method entry.
2. Spring Security's `AuthenticationManager` verifies credentials (reads user from DB).
3. The user is loaded again to generate a JWT token.
4. **Transaction commits** on return. No writes occur — the transaction provides a consistent read snapshot so the user record cannot change between authentication and token generation.

**Why a transaction is needed:** The login flow performs two reads (authentication check + user load for token generation). A transaction guarantees these reads see a consistent state — for example, preventing a scenario where the user's role changes between the two reads.

## Inter-Service Communication

During registration, this service calls the recruitment service synchronously:

```
POST {recruitment.service.url}/api/recruitment/persons
Body: { personId, email, pnr }
```

If this call fails, the compensating transaction described above ensures data consistency.
