import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

test.describe("GET/PATCH /api/v1/dishes/{ref}", () => {
  test("returns dish by ref", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes/TEST-0001`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.ref).toBe("TEST-0001");
    expect(data.title).toBe("Test dish 1");
    expect(data.comments).toBeInstanceOf(Array);
    expect(data.history).toBeInstanceOf(Array);
  });

  test("returns 404 for nonexistent ref", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes/NOPE-9999`, { headers });
    expect(res.status()).toBe(404);
  });

  test("updates dish status", async ({ request }) => {
    const res = await request.patch(`${BASE}/api/v1/dishes/TEST-0001`, { headers, data: { status: "todo" } });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("todo");
  });

  test("updates dish body", async ({ request }) => {
    const res = await request.patch(`${BASE}/api/v1/dishes/TEST-0001`, { headers, data: { body: "# Updated\n\nNew content" } });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.body).toContain("# Updated");
  });
});
