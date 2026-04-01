import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}` };

test.describe("GET /api/v1/projects", () => {
  test("returns projects with valid key", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/projects`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.count).toBe(3);
    expect(data.projects[0]).toHaveProperty("shortCode");
    expect(data.projects[0]).toHaveProperty("name");
  });

  test("returns 401 without key", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/projects`);
    expect(res.status()).toBe(401);
  });

  test("returns 401 with invalid key", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/projects`, { headers: { Authorization: "Bearer bad_key" } });
    expect(res.status()).toBe(401);
  });
});
