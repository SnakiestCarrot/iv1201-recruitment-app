# Cross-Browser Testing Checklist

**Browsers:** Chrome, Firefox, Edge, Safari

For each browser, go through every step below and mark pass/fail.

## 1. Authentication

### Login
- [ ] Navigate to `/#/login` — page loads, form is centered
- [ ] Language dropdown works (switch to Svenska, text updates)
- [ ] Submit empty form — validation errors appear
- [ ] Submit with invalid credentials — error message shown
- [ ] Submit with valid credentials — redirects to dashboard
- [ ] "Old user?" link expands email form
- [ ] Old user email form submits without error
- [ ] "Back to login" collapses old user form
- [ ] "Register" link navigates to register page

### Register (Applicant)
- [ ] Navigate to `/#/register` — page loads, form is centered
- [ ] Language dropdown works
- [ ] Submit empty form — validation errors appear for all fields
- [ ] Enter invalid email format — validation error shown
- [ ] Enter invalid pnr format — validation error shown
- [ ] Enter mismatched passwords — error shown
- [ ] Submit valid form — success or appropriate server response
- [ ] "Login" link navigates back to login

### Register (Recruiter)
- [ ] Navigate to `/#/register/recruiter` — page loads, form is centered
- [ ] All fields validate correctly (username, password, confirmPassword, email, pnr, secret code)
- [ ] Submit valid form — success or appropriate server response

## 2. Dashboard

- [ ] After login, dashboard renders with username and role
- [ ] Applicant sees "Apply Now" link
- [ ] Recruiter does NOT see "Apply Now" link
- [ ] Logged-in status box displays correctly

## 3. Top Navigation Bar

- [ ] All nav links render (Dashboard, Application/Applications, Settings)
- [ ] Language dropdown switches between English and Svenska
- [ ] All page content updates on language change
- [ ] Logout button logs out and redirects to login
- [ ] Topbar is sticky (stays at top when scrolling)
- [ ] No horizontal or vertical overflow/scroll caused by topbar

## 4. Application Form (Applicant)

- [ ] Navigate to `/#/application` — form loads
- [ ] Name and surname fields accept input
- [ ] Name/surname validation rejects invalid characters
- [ ] Competence dropdown populates options
- [ ] Add competence — appears in list
- [ ] Remove competence — removed from list
- [ ] Add availability period (from/to dates)
- [ ] Remove availability — removed from list
- [ ] Submit valid application — success message shown
- [ ] Submit with empty required fields — validation errors shown

## 5. Application List (Recruiter)

- [ ] Navigate to `/#/applications` — table loads with applications
- [ ] Search filter narrows results by name
- [ ] Status filter works (All, Unhandled, Accepted, Rejected)
- [ ] Click a row — navigates to application detail

## 6. Application Detail (Recruiter)

- [ ] Applicant info displayed (name, surname, email, pnr)
- [ ] Competences listed correctly
- [ ] Availability periods listed correctly
- [ ] Status buttons work (Unhandled, Accept, Reject)
- [ ] Status change shows success message
- [ ] Back button returns to application list

## 7. Profile / Settings

- [ ] Navigate to `/#/profile` — form loads
- [ ] Email field accepts input, placeholder shows
- [ ] Pnr field accepts input, placeholder shows
- [ ] Submit with invalid email — validation error shown, clears on input
- [ ] Submit with invalid pnr — validation error shown, clears on input
- [ ] Submit with valid data — success message shown
- [ ] Submit with empty fields (optional) — no errors, submits successfully

## 8. Internationalization (i18n)

- [ ] Switch language on login page — all labels update
- [ ] Switch language on topbar — all page content updates
- [ ] Validation error messages display in correct language
- [ ] Profile page labels display in correct language
- [ ] Dashboard text displays in correct language
- [ ] Language preference persists after page reload

## 9. Layout & Styling

- [ ] White background, black text across all pages
- [ ] No unwanted horizontal scroll on any page
- [ ] No unwanted vertical scroll when content fits viewport
- [ ] Forms are centered on the page
- [ ] Buttons have consistent blue styling
- [ ] Disabled buttons appear grayed out
- [ ] Responsive layout at 768px breakpoint (topbar stacks)

## 10. Session & Navigation

- [ ] Direct URL access to `/#/dashboard` without login redirects to login
- [ ] Browser back/forward buttons work correctly
- [ ] Page refresh preserves logged-in state
- [ ] Logout clears session, prevents access to authenticated pages

---

## Results

| Test Section           | Chrome | Firefox | Edge | Safari |
|------------------------|--------|---------|------|--------|
| Login                  |        |         |      |        |
| Register (Applicant)   |        |         |      |        |
| Register (Recruiter)   |        |         |      |        |
| Dashboard              |        |         |      |        |
| Top Navigation         |        |         |      |        |
| Application Form       |        |         |      |        |
| Application List       |        |         |      |        |
| Application Detail     |        |         |      |        |
| Profile / Settings     |        |         |      |        |
| i18n                   |        |         |      |        |
| Layout & Styling       |        |         |      |        |
| Session & Navigation   |        |         |      |        |

Mark each cell as PASS, FAIL (with note), or N/A.
