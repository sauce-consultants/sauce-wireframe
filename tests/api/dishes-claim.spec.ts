import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}` };

test.describe("POST /api/v1/dishes/{ref}/claim", () => {
  test("claims a dish", async ({ request }) => {
    const res = await request.post(`${BASE}/api/v1/dishes/TEST-0002/claim`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.dish.agent).toBe("test-agent");
  });

  test("returns 404 for invalid ref", async ({ request }) => {
    const res = await request.post(`${BASE}/api/v1/dishes/NOPE-9999/claim`, { headers });
    expect(res.status()).toBe(404);
  });
});
