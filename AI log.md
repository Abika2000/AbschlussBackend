# AI Log

## 2026-08-26

- Read `AI.md` and followed its documentation requirements.
- Added the chat database schema to `DBBackendAbschluss.sql`.
- Added tables for users, posts, post images, comments, post links, and messages.
- Fixed Swagger route discovery to scan `src/routes/*.ts` and documented the existing authentication routes with reusable OpenAPI schemas.
- Added the `/health` endpoint and complete Swagger definitions for the chat routes.
- Added `DevReadMand.md` with setup, database, and development notes.
- Updated `README.md` with the project purpose, setup commands, database tables, and available API routes.
- Schema structure check, documentation secret scan, and `git diff --check` passed.
- TypeScript validation was initially blocked by a missing `src/services/index.ts` import in `src/routes/register.ts`; the service export was then added and the project typechecked successfully.

## 2026-08-27

- Completed Swagger response schemas for posts, comments, links, messages, lists, and action responses.
- Corrected Swagger and README URLs to include the application's `/api` route prefix.
- Verified all OpenAPI schema references resolve and the project typechecks successfully.

## 2026-08-27 (continued)

- Removed obsolete weapon and ammunition database code from `database.service.ts`.
- Moved all chat database queries from `chat.service.ts` into `database.service.ts`.
- Confirmed `db.connect.ts` contains only generic MySQL connection setup.
- Final TypeScript and formatting checks passed.
- Created `TeachMe.md` with beginner explanations of imports, objects, functions, validation, routes, database queries, authentication, rate limiting, and Swagger.
- Added `GET /api/weather/:date` using Open-Meteo daily forecast data, Zod validation, Swagger documentation, and README/TeachMe setup notes.
