import { test, expect, Page } from '@playwright/test';

async function testCellFocusChange(page: Page, from: {row: number, col: number},  to: {row: number, col: number}, keyPress: string) {
  const fromCell = page.getByTestId(`grid-cell-${from.row}-${from.col}`);
  //const toCell = page.getByTestId(`grid-cell-${to.row}-${to.col}`);
  await fromCell.waitFor();
  await fromCell.focus();
  await page.keyboard.press(keyPress);
  await expectCellToContainActiveElement(page, to.row, to.col);
  //await expect(toCell).toBeFocused();
}

async function setToolkit(page: Page, mode: 'vanilla' | 'ngzorro') {
  if (mode === 'vanilla') {
    await page.getByTestId('toolkit-vanilla').click();
  } else {
    await page.getByTestId('toolkit-ngzorro').click();
  }
}

async function expectCellToContainActiveElement(page: Page, row: number, col: number) {
  const expectedId = `grid-cell-${row}-${col}`;

  await expect
    .poll(async () => {
      return await page.evaluate((id) => {
        const active = document.activeElement as HTMLElement | null;
        if (!active) return null;

        const cell = active.closest<HTMLElement>('[data-test-id^="grid-cell-"]');
        return cell?.getAttribute('data-test-id') ?? null;
      }, expectedId);
    }, {  
      message: `Expected focus to be inside ${expectedId}`,
    })
    .toBe(expectedId);
}

function defineGridNavigationTests(mode: 'vanilla' | 'ngzorro') {
  test.describe(`${mode} basic grid navigation`, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await setToolkit(page, mode);
    });

    test('Alt+ArrowDown moves from (0,0) to (1,0)', async ({ page }) => {
        await testCellFocusChange(page, { row: 0, col: 0}, { row: 1, col: 0}, 'Alt+ArrowDown');
    });

    test('Alt+ArrowUp moves from (1,0) to (0,0)', async ({ page }) => {
        await testCellFocusChange(page, { row: 1, col: 0}, { row: 0, col: 0}, 'Alt+ArrowUp');
    });

    test('Alt+ArrowRight moves from (0,0) to (0,1)', async ({ page }) => {
        await testCellFocusChange(page, { row: 0, col: 0}, { row: 0, col: 1}, 'Alt+ArrowRight');
    });

    test('Alt+ArrowLeft moves from (0,1) to (0,0)', async ({ page }) => {
        await testCellFocusChange(page, { row: 0, col: 0}, { row: 0, col: 1}, 'Alt+ArrowRight');
        await testCellFocusChange(page, { row: 0, col: 1}, { row: 0, col: 0}, 'Alt+ArrowLeft');
    });
  });
};

defineGridNavigationTests('vanilla');
defineGridNavigationTests('ngzorro');