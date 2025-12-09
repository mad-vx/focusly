import { test, expect, Page, Locator } from '@playwright/test';

async function testCellFocusChange(page: Page, from: {row: number, col: number},  to: {row: number, col: number}, keyPress: string) {
  const fromCell = setCellFocus(page, from);
  //const toCell = page.getByTestId(`grid-cell-${to.row}-${to.col}`);
  await page.keyboard.press(keyPress);
  await expectCellToContainActiveElement(page, to.row, to.col);
  //await expect(toCell).toBeFocused();
}

async function setCellFocus(page: Page, from: {row: number, col: number}): Promise<Locator> {
  const cell = page.getByTestId(`grid-cell-${from.row}-${from.col}`);
  await cell.waitFor();
  await cell.focus();
  return cell;
}

async function setToolkit(page: Page, mode: 'Vanilla' | 'NG-Zorro') {
  if (mode === 'Vanilla') {
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

function defineGridNavigationTests(mode: 'Vanilla' | 'NG-Zorro') {
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

    test('End moves from (0,0) to (0,3)', async ({ page }) => {
        await testCellFocusChange(page, { row: 0, col: 0}, { row: 0, col: 3}, 'End');
    });

    test('Home moves from (0,3) to (0,0)', async ({ page }) => {
        await testCellFocusChange(page, { row: 0, col: 3}, { row: 0, col: 0}, 'Home');
    });

    test('PageDown moves from (0,3) to (9, 3)', async ({ page }) => {
        await testCellFocusChange(page, { row: 0, col: 3}, { row: 9, col: 3}, 'PageDown');
    });

    test('PageUp moves from (9,0) to (0,0)', async ({ page }) => {
        await testCellFocusChange(page, { row: 9, col: 0}, { row: 0, col: 0}, 'PageUp');
    });

    test.only('Grid walk - multiple keypress', async ({ page }) => {
        await setCellFocus(page, { row: 0, col: 0});
        await page.keyboard.press('Alt+ArrowRight');
        await expectCellToContainActiveElement(page, 0, 1);
        await page.keyboard.press('Alt+ArrowRight');
        await expectCellToContainActiveElement(page, 0, 2);
        await page.keyboard.press('Alt+ArrowRight');
        await expectCellToContainActiveElement(page, 0, 3);
        await page.keyboard.press('Alt+ArrowDown');
        await page.keyboard.press('Alt+ArrowDown');
        await page.keyboard.press('Alt+ArrowDown');
        await expectCellToContainActiveElement(page, 3, 3);
        await page.keyboard.press('Home');
        await expectCellToContainActiveElement(page, 3, 0);
        await page.keyboard.press('PageDown');
        await expectCellToContainActiveElement(page, 9, 0);
        await page.keyboard.press('End');
        await expectCellToContainActiveElement(page, 9, 3);
        await page.keyboard.press('PageUp');
        await expectCellToContainActiveElement(page, 0, 3);
        await page.keyboard.press('Alt+ArrowLeft');
        await page.keyboard.press('Alt+ArrowLeft');
        await expectCellToContainActiveElement(page, 0, 1);
        await page.keyboard.press('Alt+ArrowDown');
        await page.keyboard.press('Alt+ArrowDown');
        await page.keyboard.press('Alt+ArrowDown');
        await page.keyboard.press('Alt+ArrowDown');
        await expectCellToContainActiveElement(page, 4, 1);
        await page.keyboard.press('Alt+ArrowUp');
        await page.keyboard.press('Alt+ArrowUp');
        await page.keyboard.press('Alt+ArrowUp');
        await expectCellToContainActiveElement(page, 1, 1);
    });
  });
};

defineGridNavigationTests('Vanilla');
defineGridNavigationTests('NG-Zorro');