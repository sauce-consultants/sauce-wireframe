import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:3002";
const KEY = "sk_test_key_001";
const headers = { Authorization: `Bearer ${KEY}` };

test.describe("Dish search via API data", () => {
  test("dishes have searchable fields (title, ref, customerName)", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes`, { headers });
    expect(res.status()).toBe(200);
    const data = await res.json();

    // Every dish should have the fields the search bar filters on
    for (const dish of data.dishes) {
      expect(dish).toHaveProperty("title");
      expect(dish).toHaveProperty("ref");
      expect(dish).toHaveProperty("customerName");
      expect(typeof dish.title).toBe("string");
      expect(typeof dish.ref).toBe("string");
      expect(typeof dish.customerName).toBe("string");
    }
  });

  test("dish refs follow PROJECT_CODE-NUMBER format", async ({ request }) => {
    const res = await request.get(`${BASE}/api/v1/dishes?project=TEST`, { headers });
    const data = await res.json();

    for (const dish of data.dishes) {
      expect(dish.ref).toMatch(/^TEST-\d{4}$/);
    }
  });

  test("board endpoint returns dishes with fields needed for search", async ({ request }) => {
    const res = await request.get(`${BASE}/api/the-kitchen`);
    expect(res.status()).toBe(200);
    const board = await res.json();

    // Check a dish from each non-empty column has searchable fields
    const allDishes = [
      ...board.backlog,
      ...board.todo,
      ...board.in_progress,
      ...board.review,
      ...board.done,
    ];

    expect(allDishes.length).toBeGreaterThan(0);

    for (const dish of allDishes) {
      expect(dish).toHaveProperty("title");
      expect(dish).toHaveProperty("ref");
      expect(dish).toHaveProperty("customerName");
    }
  });

  test("dishes are distinguishable by title for search filtering", async ({ request }) => {
    const res = await request.get(`${BASE}/api/the-kitchen`);
    const board = await res.json();

    const allDishes = [
      ...board.backlog,
      ...board.todo,
      ...board.in_progress,
      ...board.review,
      ...board.done,
    ];

    // Each dish should have a unique title
    const titles = allDishes.map((d: { title: string }) => d.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });
});
