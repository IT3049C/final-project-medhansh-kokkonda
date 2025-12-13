import { test, expect } from "@playwright/test";

test("Tic Tac Toe loads with empty board", async ({ page }) => {
  await page.goto("/tictactoe");

  await expect(page.getByText("Tic Tac Toe")).toBeVisible();

  const cells = page.getByRole("button", { name: /tic-tac-toe cell/i });
  await expect(cells).toHaveCount(9);
});

test("Tic Tac Toe allows moves", async ({ page }) => {
  await page.goto("/tictactoe");

  const firstCell = page.getByRole("button", { name: "tic-tac-toe cell 0" });
  await firstCell.click();
  await expect(firstCell).toHaveText("X");
});

test("Tic Tac Toe can be reset", async ({ page }) => {
  await page.goto("/tictactoe");

  const firstCell = page.getByRole("button", { name: "tic-tac-toe cell 0" });
  await firstCell.click();
  await page.getByRole("button", { name: "Reset" }).click();

  await expect(firstCell).toHaveText("");
});
