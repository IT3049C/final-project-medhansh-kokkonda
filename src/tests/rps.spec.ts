import { test, expect } from "@playwright/test";

test("RPS loads with initial state", async ({ page }) => {
  await page.goto("/rps");

  await expect(page.getByText("Rock Paper Scissors")).toBeVisible();
  await expect(page.getByText("Round 1")).toBeVisible();
  await expect(page.getByText(/You: 0 — CPU: 0/)).toBeVisible();
});

test("RPS allows interaction and updates score/round", async ({ page }) => {
  await page.goto("/rps");

  await page.getByRole("button", { name: "Rock" }).click();

  await expect(page.getByText(/Round 2/)).toBeVisible();
});

test("RPS can be reset back to initial state", async ({ page }) => {
  await page.goto("/rps");

  await page.getByRole("button", { name: "Rock" }).click();
  await page.getByRole("button", { name: "Reset Game" }).click();

  await expect(page.getByText(/Round 1/)).toBeVisible();
  await expect(page.getByText(/You: 0 — CPU: 0/)).toBeVisible();
});
