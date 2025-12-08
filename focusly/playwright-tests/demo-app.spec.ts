import { test, expect } from '@playwright/test';

test.describe('Focusly basic grid navigation', () => {
  test('ArrowRight moves focus to next cell', async ({ page }) => {
    await page.goto('/');

    await page.pause();

    const firstCell = page.getByTestId('grid-cell-0-0');
    const nextCell = page.getByTestId('grid-cell-0-1');

    await firstCell.waitFor();
    await firstCell.focus();

    await page.keyboard.press('Alt+ArrowRight');

    await expect(nextCell).toBeFocused();
  });
});
