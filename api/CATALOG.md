# BuddyTime API catalog (main family, test env)

Captured **2026-10-23** while signed in as the **main family** (`playwright/.auth/user.json`, refreshed via setup). Pages were opened **read-only** except **Dashboard**: one child was **created** then **deleted** with a unique name. Static assets, fonts, images, analytics, and Next.js data payloads were ignored.

| method | path (ids → `{id}`) | page that called it | how it's authenticated | status seen | request body fields (writes) | response top-level fields and types | safe for tests? | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/v1/me` | Dashboard; Friends; Communities; Availability; Playdates; Birthdays; Profile | Bearer token (`Authorization` header; token sourced from `bt_token` in storage state / localStorage after login) | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | `parent`: object; `family`: object; `isAdmin`: boolean | yes | executed |
| GET | `/api/v1/connections` | Dashboard; Friends; Communities; Availability; Playdates; Birthdays; Profile | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | array of connection objects (non-empty in this session) | yes | executed |
| GET | `/api/v1/communities` | Dashboard; Communities; Birthdays | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | array of community objects | yes | executed |
| GET | `/api/v1/communities/{id}` | Birthdays | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | `id`: string; `name`: string; `type`: string; `description`: string; `myRole`: string; `myStatus`: string; `familiesCount`: number; `pendingCount`: number; `createdAt`: string; `members`: array | yes | executed |
| GET | `/api/v1/availability` | Dashboard; Availability | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | `rules`: array; `exceptions`: array | yes | executed |
| GET | `/api/v1/playdates` | Dashboard; Playdates | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | array (empty in this session) | yes | executed |
| GET | `/api/v1/matches` | Playdates | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | array of match objects (non-empty in this session) | yes | executed |
| GET | `/api/v1/events` | Birthdays | Bearer token | 200 (`Content-Type`: `application/json; charset=utf-8`) | — | array of event objects (non-empty in this session); each item: `id`, `kind`, `title`, `startsAt`, `venueText`, `details`, `cardKey`, `status`, `rsvpToken`, `createdAt`: string; `canManage`: boolean; `childId`, `childName`, `endsAt`, `communityId`, `communityName`: string or null; `counts`: object (`yes`, `no`, `maybe`, `guestsComing`: number) | yes | executed |
| POST | `/api/v1/children` | Dashboard (add child) | Bearer token | 201 | `firstName`, `birthYear`, `birthMonth`, `gender`, `avatarKey`, `interests` | `id`: string; `firstName`: string; `birthYear`: number; `birthMonth`: number; `age`: number; `gender`: string; `interests`: array; `avatarKey`: string | yes — undo via `DELETE /api/v1/children/{id}` (observed same session) | executed |
| DELETE | `/api/v1/children/{id}` | Dashboard (remove child) | Bearer token | 204 | — | empty body | yes (cleanup / paired with create) | executed |
| PATCH | `/api/v1/families` | Profile (save family details — **not invoked** this session) | Bearer token (inferred from same app session as other `/api/v1/*` calls) | — | unknown (not observed) | unknown | no — write without observed undo in this session | inspected only (routed in `tests/aqpbt-18-Profile-family-details.spec.ts`; Profile visit was read-only) |

### Page → API calls (executed only)

| App page (`AppRoute`) | API requests observed on load / idle |
| --- | --- |
| Dashboard (`/app`) | `GET /me`, `GET /connections`, `GET /communities`, `GET /playdates`, `GET /availability`; plus `POST` + `DELETE /children` during the controlled add/remove |
| Friends (`/friends`) | `GET /me`, `GET /connections` |
| Communities (`/communities`) | `GET /me`, `GET /connections`, `GET /communities` |
| Availability (`/availability`) | `GET /me`, `GET /connections`, `GET /availability` |
| Playdates (`/playdates`) | `GET /me`, `GET /connections`, `GET /playdates`, `GET /matches` |
| Birthdays (`/birthdays`) | `GET /me`, `GET /connections`, `GET /communities`, `GET /communities/{id}`, `GET /events` |
| Profile (`/profile`) | `GET /me`, `GET /connections` |

### Unauthenticated GET (no `Authorization` header)

Probed **2026-10-23** for the same safe GET paths. All returned **401** with `Content-Type: application/json; charset=utf-8` (asserted in `api/*.api.spec.ts` via `CATALOG_UNAUTHENTICATED_GET_STATUS`).

| method | path | status without token | `Content-Type` |
| --- | --- | --- | --- |
| GET | `/api/v1/me` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/connections` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/communities` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/communities/{id}` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/availability` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/playdates` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/matches` | 401 | `application/json; charset=utf-8` |
| GET | `/api/v1/events` | 401 | `application/json; charset=utf-8` |

## Not yet tested

- **Pagination / filtering** — list endpoints (`connections`, `communities`, `matches`, `events`, `playdates`) returned full arrays; no `page`, `cursor`, or `limit` query params observed.
- **Error response shape** — only 200/201/204 and unauthenticated **401** seen; no other 4xx/5xx JSON schema captured (e.g. validation vs not-found).
- **Rate limits** — not exercised.
- **Expired or invalid token** — not observed (only missing token → 401).
- **PATCH `/api/v1/families`** — request/response fields and success status not captured (save was not clicked on Profile).
- **Nested object schemas** — `parent`, `family`, and list item inner fields on `GET /me` and most list endpoints were not fully typed (only top-level keys recorded). **`GET /events` list items** are typed in `api/events.api.spec.ts` (executed **2026-10-23**).
- **Communities list on Friends / Availability** — no extra community-specific calls beyond the table above; detail `GET /communities/{id}` appeared only on Birthdays (likely tied to seeded community context on that page).
