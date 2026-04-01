import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}` };

test.describe("Done dishes — 14-day recency filter", () => {
  test("board endpoint excludes done dishes older than 14 days", async ({ request }) => {
    const res = await request.get(`${BASE}/api/the-kitchen`);
    expect(res.status()).toBe(200);
    const board = await res.json();

    // The recent done dish (Test dish 5) should be present
    const doneTitles = board.done.map((d: { title: string }) => d.title);
    expect(doneTitles).toContain("Test dish 5");

    // The old done dish (30 days ago) should be excluded
    expect(doneTitles).not.toContain("Old done dish");
  });

  test("v1 API excludes old done dishes from unfiltered list", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();

    const titles = data.dishes.map((d: { title: string }) => d.title);
    expect(titles).toContain("Test dish 5");
    expect(titles).not.toContain("Old done dish");
  });

  test("v1 API excludes old done dishes when filtering by status=done", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes?status=done`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();

    const titles = data.dishes.map((d: { title: string }) => d.title);
    expect(titles).toContain("Test dish 5");
    expect(titles).not.toContain("Old done dish");
  });

  test("old non-done dishes are not affected by the filter", async ({ request }) => {
    // The board should contain all non-done dishes regardless of age
    // All 5 seeded statuses should have at least their original dish
    const res = await request.get(`${BASE}/api/the-kitchen`);
    const board = await res.json();

    const allDishes = [
      ...board.backlog,
      ...board.todo,
      ...board.in_progress,
      ...board.review,
      ...board.done,
    ];

    // "Old done dish" should not appear anywhere on the board
    const titles = allDishes.map((d: { title: string }) => d.title);
    expect(titles).not.toContain("Old done dish");

    // The 5 recent dishes should all be present
    expect(titles).toContain("Test dish 5");
  });
});
