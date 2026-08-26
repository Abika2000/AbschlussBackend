# AI Log

## 2026-08-26

- Read `AI.md` and followed its documentation requirements.
- Added the chat database schema to `DBBackendAbschluss.sql`.
- Added tables for users, posts, post images, comments, post links, and messages.
- Fixed Swagger route discovery to scan `src/routes/*.ts` and documented the existing authentication routes with reusable OpenAPI schemas.
- Added `DevReadMand.md` with setup, database, and development notes.
- Updated `README.md` with the project purpose, setup commands, database tables, and available API routes.
- Schema structure check, documentation secret scan, and `git diff --check` passed.
- TypeScript validation remains blocked by the pre-existing missing `src/services/index.ts` import in `src/routes/register.ts`.
