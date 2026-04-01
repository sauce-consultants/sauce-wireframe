import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

test.describe("POST /api/v1/dishes/{ref}/comments", () => {
  test("adds a comment", async ({ request }) => {
    const res = await request.post(`${BASE}/api/v1/dishes/TEST-0001/comments`, { headers, data: { content: "API test comment" } });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data.id).toBeDefined();
  });

  test("rejects empty content", async ({ request }) => {
    const res = await request.post(`${BASE}/api/v1/dishes/TEST-0001/comments`, { headers, data: { content: "" } });
    expect(res.status()).toBe(400);
  });

  test("returns 404 for invalid ref", async ({ request }) => {
    const res = await request.post(`${BASE}/api/v1/dishes/NOPE-9999/comments`, { headers, data: { content: "test" } });
    expect(res.status()).toBe(404);
  });
});
