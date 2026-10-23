# Pozi Community Feedback Map

A web app for residents to report issues on a map (potholes, fallen trees, injured animals and so on), see what others have reported, export the reports to CSV, and import past feedback from a GeoJSON file.

## Features

1. **Interactive map** – OpenStreetMap tiles via Leaflet, centred on Melbourne.
2. **Add feedback** – click the map to drop a pin, choose a category, write a comment and submit. Click again to move the pin before submitting.
3. **Feedback history** – all feedback is listed in the side panel (newest first) and shown on the map as circles coloured by category. Click a circle for details. Category chips filter both the list and the map.
4. **Export CSV** – downloads the feedback currently shown (respecting the category filter).
5. **Import GeoJSON** – loads feedback from a GeoJSON `FeatureCollection` of Points. Invalid features are skipped and counted.

## Tech stack

| Part | Tools |
| --- | --- |
| Client | React 19, Vite, React Leaflet, React Hook Form, PapaParse |
| Server | Node.js, Express 5, Zod |

## Requirements

- Node.js **20.19 or newer** (`node -v` to check)
- npm

## Run it locally

The app has two parts that run side by side. Use two terminals.

**1. Backend** (http://localhost:3000)

```bash
cd backend
npm install
npm run dev
```

**2. Client** (http://localhost:5173)

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server forwards `/api` requests to the backend, so no extra setup is needed.

To use a different backend port, start it with `PORT=4000 npm run dev` and update the proxy target in `client/vite.config.js`.

### Try it with sample data

Click **Import GeoJSON** in the side panel and choose [`sample-feedback.geojson`](sample-feedback.geojson) from the project root. Six reports appear around central Melbourne.

### Production build

```bash
cd client
npm run build
```

The static files are written to `client/dist`.

## Tests

Tests use Jest. Run them from each folder:

```bash
cd backend
npm test

cd client
npm test
```

- **Backend:** every API route, with supertest. Covers valid and invalid submissions, and imports that mix good and bad features.
- **Client:** the CSV builder (column order, category labels, escaping commas, quotes and line breaks, blocking spreadsheet formulas) and date formatting.

Jest runs in Node's ES module mode, so you'll see an `ExperimentalWarning: VM Modules` message. It's expected and harmless.

## API

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| GET | `/api/feedback` | – | `200` GeoJSON FeatureCollection |
| POST | `/api/feedback` | `{ category, comment, lat, lng }` | `201` the saved Feature, or `400` |
| POST | `/api/feedback/import` | GeoJSON FeatureCollection | `201 { imported, rejectedCount }`, or `400` if it isn't a FeatureCollection |

Categories: `pothole`, `tree_down`, `dead_animal`, `injured_animal`, `other`.

## Project structure

```
backend/
  app.js              Express routes and in-memory store
  index.js            Starts the server
  feedbackSchema.js   Validation rules (Zod), shared by submit and import
  app.test.js         API tests
client/src/
  App.jsx             Owns app state: selected spot, feedback list, category filter
  api/                Calls to the backend
  components/         Map, feedback form, feedback history
  constants/          Category list (labels and colours)
  utils/              Date formatting, CSV building, file download (with tests)
sample-feedback.geojson
```

## Design decisions

- **GeoJSON is the data model.** Each piece of feedback is stored as a GeoJSON Feature, so the server's response, the import file and the map all use the same format. Import is a merge rather than a conversion.
- **Coordinates are `[longitude, latitude]` in GeoJSON and `[latitude, longitude]` in Leaflet.** The swap happens in one place on the server and one place on the map.
- **The server validates everything.** Form submissions and every imported feature go through the same Zod schema. One bad feature in an import doesn't reject the whole file.
- **Single source of state.** `App` holds the selected spot, the feedback list and the filter. The panel shows the form when a spot is selected and the history otherwise, so there's no separate mode to keep in sync.
- **Safe CSV export.** Comments are escaped, and cells starting with `=`, `+`, `-` or `@` are prefixed so spreadsheet apps don't run them as formulas (CSV injection).

## Known limitations

- Feedback is stored **in memory**, so it's lost when the backend restarts. Re-import the sample file after a restart.
- No user accounts or authentication.
- The category list is defined in both the client and the server and must be kept in sync by hand.
- Importing the same file twice creates duplicates (each import gets new IDs).

## Next steps

- Store feedback in a database (PostgreSQL with PostGIS).
- Share the category list and validation schema between client and server through a shared package.
- Add component tests for the form and map (React Testing Library).
- Click a list item to zoom to it on the map; cluster markers when there are many.
- Add a light theme (colours are already CSS variables).
- Convert to TypeScript.
