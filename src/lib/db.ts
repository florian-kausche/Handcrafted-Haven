// Postgres helper removed. The project uses MongoDB (Mongoose).
// This file is intentionally a no-op to avoid accidental imports.

export default null

export async function initDatabase() {
  throw new Error('Postgres initDatabase removed; use MongoDB seeding (scripts/seed-db.ts or scripts/seed-mongo.js)')
}

