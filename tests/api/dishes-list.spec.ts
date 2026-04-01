import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}` };

test.describe("GET /api/v1/dishes", () => {
  test("returns all dishes", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.count).toBe(5);
    expect(data.dishes[0]).toHaveProperty("body");
    expect(data.dishes[0]).toHaveProperty("comments");
    expect(data.dishes[0]).toHaveProperty("history");
  });

  test("filters by project", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes?project=TEST`, { headers });
    const data = await res.json();
    expect(data.count).toBe(5);
  });

  test("filters by status", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes?status=done`, { headers });
    const data = await res.json();
    expect(data.count).toBeGreaterThanOrEqual(1);
    for (const dish of data.dishes) {
      expect(dish.status).toBe("done");
    }
  });

  test("returns empty for nonexistent project", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes?project=NOPE`, { headers });
    expect(res.status()).toBe(404);
  });
});
