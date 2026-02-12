# Frontend Service

React 19 single-page application built with TypeScript and Vite. Supports English and Swedish via i18next. Uses a feature-based folder structure with the MVP/Presenter pattern.

## Architecture

The codebase follows the **MVP (Model-View-Presenter)** pattern implemented with React hooks:

- **Views** (`views/`) — React components that render UI. They receive all state and callbacks from presenters via hooks and contain no business logic.
- **Presenters** (`presenters/`) — Custom hooks that manage state, validation, and API calls. They return a clean interface of state values and handler functions.
- **Services** (`services/`) — Plain functions that make HTTP requests to the backend. They handle request/response formatting and error extraction.
- **Types** (`types/`) — TypeScript interfaces for each feature's data models.

```
User interaction → View → Presenter (hook) → Service → Backend API
                    ↑          │
                    └──────────┘
                   (state + callbacks)
```

### Folder Structure

```
src/
├── features/
│   ├── auth/                        # Authentication feature
│   │   ├── hooks/useAuth.ts         # Auth state hook (JWT decode, cross-tab sync)
│   │   ├── presenters/
│   │   │   ├── useAuthPresenter.ts          # Login + applicant registration
│   │   │   └── useRecruiterAuthPresenter.ts # Recruiter registration
│   │   ├── services/authService.ts  # Auth API calls
│   │   ├── types/authTypes.ts       # Auth interfaces
│   │   ├── views/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RecruiterRegisterForm.tsx
│   │   ├── styles/
│   │   └── tests/
│   ├── application/                 # Job application feature
│   │   ├── presenters/useApplicationPresenter.ts
│   │   ├── services/applicationService.ts
│   │   ├── types/applicationTypes.ts
│   │   ├── views/ApplicationForm.tsx
│   │   ├── styles/
│   │   └── tests/
│   ├── dashboard/                   # User dashboard
│   │   ├── presenters/useDashboardPresenter.ts
│   │   ├── services/dashboardService.ts
│   │   ├── types/dashboardTypes.ts
│   │   ├── views/Dashboard.tsx
│   │   ├── styles/
│   │   └── tests/
│   └── recruiter/                   # Recruiter application review
│       ├── presenters/
│       │   ├── useApplicationListPresenter.ts
│       │   └── useApplicationDetailPresenter.ts
│       ├── services/recruiterService.ts
│       ├── types/recruiterTypes.ts
│       ├── views/
│       │   ├── ApplicationList.tsx
│       │   └── ApplicationDetail.tsx
│       ├── styles/
│       └── tests/
├── components/                      # Shared components
│   ├── AuthenticatedTopbar.tsx      # Nav bar with logout + language switcher
│   ├── LanguageDropdown.tsx         # EN/SV language selector
│   ├── ErrorBoundary.tsx            # React error boundary
│   └── tests/
├── utils/
│   └── validation.ts               # Zod validation schemas
├── locales/
│   ├── en/translation.json          # English translations
│   └── sv/translation.json          # Swedish translations
├── App.tsx                          # Root component with routing
├── main.tsx                         # Entry point
├── i18n.ts                          # i18next configuration
└── setupTests.ts                    # Test setup (testing-library matchers)
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API gateway base URL | `http://localhost:8080` |

Set via `.env` file in the project root or as a shell environment variable. The `VITE_` prefix is required by Vite to expose it to client code.

## Features

### Authentication (`features/auth/`)

- **Login** — Username/password authentication, JWT stored in localStorage
- **Applicant Registration** — Username, email, personal number (personnummer), password with confirmation
- **Recruiter Registration** — Same as applicant plus a secret registration code
- **Legacy User Reset** — Password reset flow for migrated users (sends mock email)
- **Cross-tab sync** — Auth state synchronizes across browser tabs via `storage` events and a custom `AUTH_CHANGED_EVENT`

### Job Application (`features/application/`)

- Multi-section form: personal details, competence profiles (skill + years of experience), availability periods (date ranges)
- Dynamic add/remove for competences and availability entries
- Zod validation on all personal detail fields before submission

### Dashboard (`features/dashboard/`)

- Shows the authenticated user's role and username
- Links to the appropriate feature (apply for applicants, review for recruiters)
- Redirects to login if the JWT is missing or invalid

### Recruiter Review (`features/recruiter/`)

- **Application List** — Table of all applications with search-by-name and filter-by-status (All, Unhandled, Accepted, Rejected)
- **Application Detail** — Full view of an applicant's profile, competences, and availability. Status can be updated with a dropdown.
- **Optimistic locking** — Status updates send the current `version`; if another recruiter changed it concurrently, a 409 Conflict is shown

## Routing

Defined in `App.tsx` using `HashRouter`:

| Path | Component | Access |
|------|-----------|--------|
| `/` | Redirect to `/login` | Public |
| `/login` | `LoginForm` | Public |
| `/register` | `RegisterForm` | Public |
| `/register/recruiter` | `RecruiterRegisterForm` | Public |
| `/dashboard` | `Dashboard` | Authenticated |
| `/application` | `ApplicationForm` | Applicants only (roleId !== 1) |
| `/applications` | `ApplicationList` | Recruiters only (roleId === 1) |
| `/applications/:id` | `ApplicationDetail` | Recruiters only (roleId === 1) |
| `*` | Redirect to `/login` | Catch-all |

Role-based access is enforced by conditional `<Navigate>` components in `App.tsx`. The `useAuth` hook decodes the JWT to determine `roleId`.

## State Management

No external state management library is used. State is managed through:

- **Presenter hooks** — Each feature's custom hook manages its own state via `useState`
- **localStorage** — Persists the JWT token (`authToken`) and language preference (`lang`)
- **Custom events** — `AUTH_CHANGED_EVENT` synchronizes auth state across components and tabs. Dispatched on login/logout, listened to by the `useAuth` hook.

## Internationalization

Configured in `i18n.ts` using **i18next** with **react-i18next**.

**Supported languages:** English (`en`), Swedish (`sv`)

**Translation files:** `src/locales/{en,sv}/translation.json`

**Usage in components:**
```tsx
const { t } = useTranslation();
return <label>{t('common.username')}</label>;
```

**Switching language:**
```tsx
i18n.changeLanguage('sv');
```

Language preference is saved to localStorage (`lang` key) and restored on page load.

**Adding a new translation key:** Add the key to both `en/translation.json` and `sv/translation.json`. Keys are namespaced by feature (e.g., `auth.login`, `application.submit`, `recruiter.status`).

## Validation

Client-side validation uses **Zod** schemas defined in `src/utils/validation.ts`:

| Schema | Fields Validated | Used By |
|--------|-----------------|---------|
| `LoginSchema` | username (required), password (required) | `useAuthPresenter` |
| `RegisterUserSchema` | username (min 3 chars), password (min 6 chars) | `useAuthPresenter` |
| `RecruiterRegisterSchema` | Extends `RegisterUserSchema` + secretCode (required) | `useRecruiterAuthPresenter` |
| `ApplicationSchema` | name (required), surname (required), email (valid format), pnr (YYYYMMDD-XXXX format) | `useApplicationPresenter` |

Validation errors are stored as `Record<string, string>` in presenter state and displayed inline in the form views.

## Testing

### Running Tests

```bash
# Watch mode
npm test

# Single run with coverage
npm run test:coverage
```

### Framework

- **Vitest** — Test runner (configured in `vite.config.ts`)
- **React Testing Library** — Component rendering and user interaction
- **happy-dom** — Lightweight DOM environment for tests

### Testing Patterns

**Presenter tests** mock the service layer and test hook behavior:
```tsx
vi.mock('../services/authService', () => ({
  authService: { login: vi.fn(), register: vi.fn() },
}));

const { result } = renderHook(() => useAuthPresenter());
await act(async () => { await result.current.loginUser(credentials); });
expect(result.current.state.status).toBe('success');
```

**View tests** mock the presenter hook and test rendering/interactions:
```tsx
vi.mock('../presenters/useAuthPresenter');

(useAuthPresenter as any).mockReturnValue({
  state: { status: 'idle', message: '' },
  loginUser: mockLoginUser,
});

render(<LoginForm />);
fireEvent.change(screen.getByLabelText('common.username'), { target: { value: 'user' } });
fireEvent.click(screen.getByRole('button', { name: 'auth.login' }));
expect(mockLoginUser).toHaveBeenCalled();
```

**Service tests** mock `fetch` and test request formatting:
```tsx
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ token: 'abc' }),
});

const result = await authService.login({ username: 'u', password: 'p' });
expect(result.token).toBe('abc');
```

i18next is mocked in all component tests to return translation keys as-is:
```tsx
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
```

## Code Quality

- **TypeScript** — Strict mode enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- **ESLint** — TypeScript-aware rules with React hooks plugin
- **Prettier** — Code formatting
- **Build check** — `npm run build` runs `tsc` before Vite bundling, catching type errors
