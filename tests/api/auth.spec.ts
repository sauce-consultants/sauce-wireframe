import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const endpoints = ["/api/v1/projects", "/api/v1/dishes", "/api/v1/dishes/TEST-0001"];

test.describe("API authentication", () => {
  for (const endpoint of endpoints) {
    test(`${endpoint} returns 401 without key`, async ({ request }) => {
      const res = await request.get(`${BASE}${endpoint}`);
      expect(res.status()).toBe(401);
    });

    test(`${endpoint} returns 401 with bad key`, async ({ request }) => {
      const res = await request.get(`${BASE}${endpoint}`, { headers: { Authorization: "Bearer invalid" } });
      expect(res.status()).toBe(401);
    });
  }
});
