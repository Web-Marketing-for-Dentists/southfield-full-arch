# Southfield Full Arch landing page

Editable React source for the Southfield Family Dental Center full-arch campaign. This is a portable export of the approved website, including the mobile click-to-call footer, automatic patient-case gallery, appointment-request pop-up, Terms of Service, and Privacy Policy.

## What is in the page

The current campaign (creative refreshed October 26, 2026 from the V2 export) includes:

- **“Restore Your Confidence With Dental Implants”** as the hero headline, over a decorative hero background video (`client/public/videos/`, separate desktop and mobile MP4s, poster fallback for reduced motion).
- Two per-arch options: **$14,990 PMMA acrylic** and **$17,990 final zirconia**, with a **$3,000 per-arch upgrade** to final zirconia.
- Dr. Oleg’s authority panel with on-scroll count-up figures (**26+ years**, **1,000+ implants placed**). Treat these as approved marketing figures and verify them before changing them.
- A weekly promotion countdown ending each **Sunday at 11:59 PM Eastern** (`client/src/components/WeeklyPromotionCountdown.tsx`, `client/src/lib/promotionTime.ts`).
- The autoplay five-case patient gallery and Troy’s supplied patient-story thumbnail.

The V2 export shipped without tracking, lead delivery, or the DNI swap number. Those were kept from this repository: GA4 and WhatConverts in `client/index.html`, the phone constants in `client/src/lib/phone.ts`, the appointment form, popup, Pages Function, and email templates. When pulling future creative from a V2-style export, copy `Home.tsx`, `index.css`, new components, and media only, then re-point any hard-coded phone number at `@/lib/phone`.

## Run locally

Install **Node.js 22.12 or later** and use npm:

```bash
git clone https://github.com/Alex-WM4D/southfield-full-arch.git
cd southfield-full-arch
npm ci
npm run dev
```

Open the localhost address printed in the terminal. No Manus credentials, storage proxy, API keys, or environment variables are required to build this version.

## Build and preview

```bash
npm run check
npm run build
npm run preview
```

`npm run preview` serves the static site only. To run the appointment endpoint too, copy `.dev.vars.example` to `.dev.vars`, add a Mailgun sending key, and run `npm run cf:dev` (http://localhost:8788). This sends real emails.

### Deploy to Cloudflare Pages

Deploy as a **Cloudflare Pages** project (not static-only hosting), because `functions/api/appointment-request.ts` sends the lead emails.

- Framework preset None, build command `npm run build`, output directory `dist`. Node 22 is pinned by `.node-version`.
- `wrangler.jsonc` holds the non-secret settings. Its `name` must match the Pages project name.
- Add `MAILGUN_API_KEY` as an **encrypted** Pages variable for Production and Preview. Use a Mailgun **domain sending key** for `100marketers.com`, not the account-wide key or an SMTP password.
- After deploy, `GET /api/appointment-request` reports which settings are present (never their values). Then submit a test lead and confirm both messages under Mailgun → Logs.

The build creates entry files for `/terms-of-service/`, `/privacy-policy/`, `/disclaimer/`, and `/404/`. Every route has a real file, and unknown paths get `404.html` (the app's Not Found page) with a 404 status, so no `_redirects` SPA rule is needed. Cloudflare ignores `/* /index.html 200` as an infinite loop. This export uses root-relative paths, so deploy at a domain root. GitHub stores the source; pushing code does **not** publish a website until the Pages project is connected.

## Where to edit

| Change | File |
| --- | --- |
| Headlines, prices, included treatment, office hours, FAQs, patient quotes | `client/src/pages/Home.tsx` |
| Colors, fonts, spacing, responsive styling | `client/src/index.css` |
| Google Fonts and search/social metadata | `client/index.html` |
| GA4 and WhatConverts tracking tags | `client/index.html` |
| Phone number (DNI swap number) | `client/src/lib/phone.ts` |
| Weekly promotion display and Eastern-time deadline | `client/src/components/WeeklyPromotionCountdown.tsx`, `client/src/lib/promotionTime.ts` |
| Hero video loading, reduced-motion behavior, poster fallback | `client/src/components/HeroVideoBackground.tsx` |
| On-scroll authority-number animation | `client/src/components/CountUpNumber.tsx` |
| Bundled hero videos | `client/public/videos/` |
| Appointment pop-up layout, fallback scheduler | `client/src/components/AppointmentRequestPopup.tsx` |
| Appointment fields, validation, optional SMS consent | `client/src/components/AppointmentRequestForm.tsx` |
| Terms of Service and Privacy Policy | `client/src/pages/LegalPages.tsx` |
| Bundled images | `client/public/images/` |
| Favicon and touch icon (practice logo, matches southfieldsmile.com) | `client/public/favicon-32.png`, `icon-192.png`, `apple-touch-icon.png` |
| Lead notification emails (admin and patient) | `emails/*.html` |
| Lead endpoint, recipients, sender | `functions/api/appointment-request.ts`, `wrangler.jsonc` |

The phone number lives only in `client/src/lib/phone.ts`. It is the WhatConverts DNI swap number, (248) 215-2058; change it only if the swap number in WhatConverts changes. Prices, hours, offers, and policies should stay consistent across the page. For image changes, preserve the original before/after labeling, proportions, and patient consent. Confirm restoration material before adding material-specific case claims.

## Regular updates

```bash
git pull origin main
# Make your edits, then:
npm run check
npm run build
git add .
git commit -m "Describe your landing-page update"
git push origin main
```

For team work, use a feature branch and pull request. CI checks types, builds, and tests the mobile/desktop flow on pushes and pull requests. This repository is an export, **not an automatic two-way Manus sync**. Changes here will not update the original Manus preview unless deliberately transferred back, and later Manus edits will not automatically appear here.

## Appointment form and lead notifications

The pop-up has Full Name, Phone, Email, and Message. Full Name, Phone, and Email are required. Message is optional. Appointment and promotional SMS consent are independent, optional, and unchecked by default. A request never requires SMS consent.

The form posts JSON to `POST /api/appointment-request` (`functions/api/appointment-request.ts`). The function validates the fields, drops honeypot (`website`) submissions silently, and sends two emails through Mailgun's HTTPS API. They are built from the WM4D appointment-request templates:

| Email | To | Subject | From / Reply-To |
| --- | --- | --- | --- |
| Admin notification (`emails/admin-notification.html`) | `LEAD_RECIPIENT`: `reporting_southfield-mi-dentist@100marketers.com` | Get on the Horn! A New Patient Wants an Appointment | Southfield Family Dental Center `<noreply@100marketers.com>` / `noreply@100marketers.com` |
| Patient confirmation (`emails/patient-confirmation.html`) | The address typed in the form | Confirmation of Your Appointment Request With Southfield Family Dental Center | Same |

The visitor sees success only after Mailgun accepts the admin notification. If that fails, the form keeps the entries and shows the phone number. The patient confirmation is sent after the response, so a bad patient address never loses a lead. Admin notifications go **only** to the reporting inbox. Notifying the practice and team is handled outside this site, so do not add recipients here.

The admin email records each SMS choice separately, plus the consent disclosure version, submission time, landing URL (including UTM/gclid), and a request ID. The consent text and version live in `client/src/lib/appointment-request.ts`, shared by the form and the function. **Bump `SMS_CONSENT_VERSION` whenever consent wording changes.** The patient confirmation never includes visitor-typed text, so the form cannot be used to send arbitrary content from the shared `100marketers.com` domain.

A2P registration, opt-in records, and STOP/HELP handling must be verified with the texting provider before sending messages.

## Analytics and external services

`client/index.html` loads two tags on every page, including the generated policy entries:

- **GA4** (`G-50EEPYREL4`) via gtag.js.
- **WhatConverts** (profile `177101`) for call tracking, dynamic number insertion, and form tracking. It replaces the swap number (248) 215-2058 in page text and `tel:` links with the visitor's tracking number. Add the `no-swap` class to any element that must keep the original number.

WhatConverts form tracking identifies the appointment form by `id="appointment-request-form"` (also `name="appointment-request-form"`). Keep that ID if the form is edited. The form only mounts when the pop-up opens; WhatConverts re-scans for forms on click and keypress, so it still binds.

Privacy-safe `southfield:analytics` events remain available but are not yet forwarded to GA4. Browser tests block both tracking hosts so CI never sends test traffic or synthetic leads.

Images are bundled locally and do not need Manus storage. Google Fonts, Google Drive testimonial playback, TrueLark scheduling, and map directions still require internet access. Videos load only when opened. The visual locator map itself is bundled locally.

Before launch, review claims, warranty conditions, financing disclosures, image permissions, and policies with the practice. Update the policy if analytics, delivery, tracking, or messaging behavior changes. Do not deploy inquiry collection until delivery and data handling are ready.

## Browser tests

```bash
npx playwright install chromium
npm run test:e2e
```

Tests use a local production preview and synthetic entries only. They do not send appointments, emails, or SMS. The CI workflow runs these tests on mobile and desktop widths.

## Export notes

Prepared October 12, 2026 from the approved Southfield project. Website copy and design are retained; only portability-related paths, build tooling, unused template files, and managed preview dependencies were changed. `docs/asset-manifest.json` inventories all 12 bundled image assets. The original Manus project remains unchanged.

Practice-specific content and patient imagery are not licensed for unrelated reuse. Public repository visibility does not imply permission to reuse those assets. Third-party dependencies retain their own licenses.
