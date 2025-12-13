import { test, expect } from "@playwright/test";

test("loads the landing page and lists games", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("GameHub")).toBeVisible();

  await expect(page.getByRole("link", { name: "Rock Paper Scissors" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tic Tac Toe" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Wordle" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Memory Cards" })).toBeVisible();
});

test("captures a player name and shows it on a game screen", async ({ page }) => {
  await page.goto("/");

  const nameInput = page.getByLabel("Player Name");
  await nameInput.fill("Medhansh");

  await page.getByRole("link", { name: "Rock Paper Scissors" }).click();

  await expect(page.getByText(/You: 0 — CPU: 0/)).toBeVisible();
});
