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
- `GET /api/auth/me`
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
- `GET /api/weather/:date?latitude=52.52&longitude=13.41`
- `GET /health`

Swagger UI is available at `/api-docs` while the server is running.
The raw OpenAPI JSON is available at `/api-docs.json`.
Weather data is requested from [Open-Meteo](https://open-meteo.com/en/docs). The weather route needs a date in `YYYY-MM-DD` format and latitude/longitude query parameters.

More setup and development details are in [DevReadMand.md](DevReadMand.md).
For a beginner explanation of the code, see [TeachMe.md](TeachMe.md).

## Meine Entscheidungen

- Ich verwende Express, weil die Routen und Middleware damit einfach aufgebaut werden können.
- MySQL2 verbindet das Backend mit der MySQL-Datenbank. Die SQL-Werte werden als Parameter übergeben, damit Benutzereingaben nicht direkt in SQL-Strings landen.
- Zod validiert Request-Bodies, URL-Parameter und Query-Parameter. Ungültige Daten werden mit HTTP `400` abgelehnt.
- Passwörter werden mit `bcryptjs` gehasht und nicht im Klartext gespeichert.
- JWT wird für die Anmeldung verwendet. Die Benutzer-ID wird nach erfolgreicher Prüfung im Request gespeichert.
- Die Chat-Datenbankfunktionen liegen in `database.service.ts`, damit die SQL-Abfragen getrennt von den Routen bleiben.
- Die Wetterdaten kommen über `fetch` von Open-Meteo. Für die verwendeten Forecast-Daten ist kein API-Key nötig.
- Datei-Uploads wurden bewusst nicht umgesetzt. Dadurch bleibt die erste Version kleiner und braucht keine zusätzliche Dateiablage.

## KI-Einsatz

Die KI wurde als Unterstützung bei der Entwicklung verwendet. Sie half beim:

- Erstellen MySQL-DB Struktur und MySQL-Abfragen
- Planen der Datenbanktabellen für Benutzer, Posts, Kommentare, Links und Nachrichten
- Einrichten und Prüfen der Swagger-Dokumentation
- Einbauen der Open-Meteo-Wetterabfrage
- ReadMe/AI log/ DevReadMe(DevReadMand.md) immer aktualisiert und ergänzt.

Der generierte Code wurde an das vorhandene Projekt angepasst, gelesen und mit TypeScript-, Swagger- und Formatierungsprüfungen kontrolliert. Zugangsdaten und Umgebungsvariablen wurden nicht in die Dokumentation übernommen.

## Nicht umgesetzt und wie ich es angehen würde

### Admin-Rollen

Admin-Rollen und Berechtigungen sind noch nicht umgesetzt. Ich würde eine `role`-Spalte in der `users`-Tabelle ergänzen, zum Beispiel mit den Werten `user` und `admin`. Danach würde ich eine `requireAdmin`-Middleware erstellen, die zuerst das JWT prüft und anschließend die Rolle aus der Datenbank lädt. Admin-Routen würden diese Middleware zusätzlich zu `requireLogin` verwenden.

### Datei-Uploads

Bild-Uploads sind nicht umgesetzt. Ich würde zuerst festlegen, ob Dateien in einem Objektspeicher oder auf dem Server gespeichert werden sollen. Danach würde ich Dateityp und Dateigröße prüfen, einen sicheren Dateinamen erzeugen und nur die Datei-URL in der Datenbank speichern. Die Datei selbst würde ich nicht als beliebigen Benutzereingang direkt ausliefern.

### Automatisierte API-Tests

Eine vollständige Test-Suite ist noch nicht umgesetzt. Ich würde Tests für Zod-Fehler, fehlende JWTs, erfolgreiche CRUD-Abläufe, Eigentümerrechte bei Posts und externe Wetterfehler schreiben. Für Datenbanktests würde ich eine separate Testdatenbank oder Mock-Datenbank verwenden.

### Erweiterte Wetterfunktionen

Aktuell liefert die Wetterroute einen einzelnen Tag und benötigt Koordinaten. Als nächsten Schritt würde ich eine Geocoding-Suche ergänzen, damit Benutzer einen Ortsnamen statt Latitude und Longitude senden können. Danach könnten mehrere Tage, Einheiten und eine bessere Übersetzung der WMO-Wettercodes ergänzt werden.
