import { seedTestDb } from "./seed-test-db";

export default async function globalSetup() {
  await seedTestDb();
}
