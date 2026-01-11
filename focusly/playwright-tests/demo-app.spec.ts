import { test } from '@playwright/test';
import { TestKeyMap, testKeyMaps } from './keymaps';
import {
  TOOLKITS,
  ToolkitType,
  expectCellToContainActiveElement,
  setCellFocus,
  setToolkit,
  testCellFocusChange,
  toKeyPressString,
  updateFocuslyKeymap,
  //waitForGridReady,
} from './helper';

function defineGridNavigationTests(toolkitType: ToolkitType, keyMap: TestKeyMap) {
  test.describe(`${toolkitType} - ${keyMap.name} - basic grid navigation`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');

      await setToolkit(page, toolkitType);
      //await waitForGridReady(page);

      await updateFocuslyKeymap(page, keyMap);
      //await waitForGridReady(page);
    });

    test(`${toKeyPressString(keyMap.map.down)} moves from (0,0) to (1,0)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 0, col: 0 }, { row: 1, col: 0 }, keyMap.map.down);
    });

    test(`${toKeyPressString(keyMap.map.up)} moves from (1,0) to (0,0)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 1, col: 0 }, { row: 0, col: 0 }, keyMap.map.up);
    });

    test(`${toKeyPressString(keyMap.map.right)} moves from (0,0) to (0,1)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 0, col: 0 }, { row: 0, col: 1 }, keyMap.map.right);
    });

    test(`${toKeyPressString(keyMap.map.left)} moves from (0,1) to (0,0)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 0, col: 0 }, { row: 0, col: 1 }, keyMap.map.right);
      await testCellFocusChange(page, { row: 0, col: 1 }, { row: 0, col: 0 }, keyMap.map.left);
    });

    test(`${toKeyPressString(keyMap.map.end)} moves from (0,0) to (0,3)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 0, col: 0 }, { row: 0, col: 3 }, keyMap.map.end);
    });

    test(`${toKeyPressString(keyMap.map.home)} moves from (0,3) to (0,0)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 0, col: 3 }, { row: 0, col: 0 }, keyMap.map.home);
    });

    test(`${toKeyPressString(keyMap.map.pageDown)} moves from (0,3) to (9, 3)`, async ({
      page,
    }) => {
      await testCellFocusChange(page, { row: 0, col: 3 }, { row: 9, col: 3 }, keyMap.map.pageDown);
    });

    test(`${toKeyPressString(keyMap.map.pageUp)} moves from (9,0) to (0,0)`, async ({ page }) => {
      await testCellFocusChange(page, { row: 9, col: 0 }, { row: 0, col: 0 }, keyMap.map.pageUp);
    });

    test(`${toolkitType} - ${keyMap.name} - multiple keypress`, async ({ page }) => {
      await setCellFocus(page, { row: 0, col: 0 });
      await page.keyboard.press(toKeyPressString(keyMap.map.right));
      await expectCellToContainActiveElement(page, 0, 1);
      await page.keyboard.press(toKeyPressString(keyMap.map.right));
      await expectCellToContainActiveElement(page, 0, 2);
      await page.keyboard.press(toKeyPressString(keyMap.map.right));
      await expectCellToContainActiveElement(page, 0, 3);
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await expectCellToContainActiveElement(page, 3, 3);
      await page.keyboard.press(toKeyPressString(keyMap.map.pageUp));
      await expectCellToContainActiveElement(page, 0, 3);
      await page.keyboard.press(toKeyPressString(keyMap.map.pageDown));
      await expectCellToContainActiveElement(page, 9, 3);
      await page.keyboard.press(toKeyPressString(keyMap.map.end));
      await expectCellToContainActiveElement(page, 9, 3);
      await page.keyboard.press(toKeyPressString(keyMap.map.pageUp));
      await expectCellToContainActiveElement(page, 0, 3);
      await page.keyboard.press(toKeyPressString(keyMap.map.left));
      await page.keyboard.press(toKeyPressString(keyMap.map.left));
      await expectCellToContainActiveElement(page, 0, 1);
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await page.keyboard.press(toKeyPressString(keyMap.map.down));
      await expectCellToContainActiveElement(page, 4, 1);
      await page.keyboard.press(toKeyPressString(keyMap.map.up));
      await page.keyboard.press(toKeyPressString(keyMap.map.up));
      await page.keyboard.press(toKeyPressString(keyMap.map.up));
      await expectCellToContainActiveElement(page, 1, 1);
    });
  });
}

TOOLKITS.forEach((toolkit) => {
  testKeyMaps.forEach((keymap) => {
    defineGridNavigationTests(toolkit, keymap);
  });
});
