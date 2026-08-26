# Developer Readme

## Setup

1. Install dependencies with `npm install`.
2. Create a local `.env` file with the database connection and JWT settings.
3. Make sure MySQL is running and apply `DBBackendAbschluss.sql`.
4. Start the API with `npm start`.

The server reads `PORT` and `HOST` from the environment. The default port is `3000`.

## Database

`DBBackendAbschluss.sql` creates the `DBBackendAbschluss` database and the chat schema:

- `users` stores registered users and password hashes.
- `posts` stores post authors, titles, bodies, and timestamps.
- `post_images` stores one optional image per post.
- `comments` stores comments and their authors.
- `post_links` stores external links attached to posts.
- `messages` stores direct messages and read timestamps.

Foreign keys use cascading deletes so removing a user or post removes dependent records.

## Current API

Authentication routes are mounted under `/api/auth`:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Swagger UI is available at `/api-docs` when the server is running.
The raw OpenAPI document is available at `/api-docs.json`.

Swagger scans route annotations from `src/routes/*.ts`. Add OpenAPI comments beside new route declarations so they appear in the generated documentation.

## Development Notes

- Passwords are hashed with `bcryptjs` before storage.
- Protected routes use bearer JWT authentication.
- Keep `.env` local and never commit credentials or token secrets.
- The SQL script starts with `DROP DATABASE`; only run it when resetting the local database is intended.
