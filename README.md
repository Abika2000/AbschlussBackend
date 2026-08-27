# AbschlussBackend

Backend for the Wibilea final project.

## Setup

Install dependencies and configure a local `.env` file with the MySQL connection and JWT token settings:

```bash
npm install
npm start
```

The API listens on port `3000` by default. Apply `DBBackendAbschluss.sql` to create the database and tables before starting the server. The SQL script resets the database first, so use it only when a reset is intended.

## Database Tables

- `users` stores registered users and password hashes.
- `posts` stores posts and their authors.
- `comments` stores post comments and their authors.
- `post_links` stores external links attached to posts.
- `messages` stores direct messages between users.

## API

Authentication routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Chat routes (all require a bearer token):

- `GET /api/users`
- `GET /api/posts?limit=20&offset=0`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/posts/:id/comments`
- `POST /api/posts/:id/comments`
- `DELETE /api/comments/:id`
- `POST /api/posts/:id/links`
- `GET /api/posts/:id/links`
- `POST /api/messages`
- `GET /api/messages/:userId`
- `GET /health`

Swagger UI is available at `/api-docs` while the server is running.
The raw OpenAPI JSON is available at `/api-docs.json`.

More setup and development details are in [DevReadMand.md](DevReadMand.md).
