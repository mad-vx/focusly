import { Locator, Page, expect } from '@playwright/test';
import { FocuslyKeyChord } from '@zaybu/focusly';
import { TestKeyMap } from './keymaps';

export const TOOLKITS = ['Vanilla', 'NG-Zorro'] as const;
export type ToolkitType = (typeof TOOLKITS)[number];

export async function testCellFocusChange(
  page: Page,
  from: { row: number; col: number },
  to: { row: number; col: number },
  keyChords: FocuslyKeyChord | undefined,
) {
  const chords = toChordArray(keyChords);

  for (const chord of chords.length ? chords : ['']) {
    await setCellFocus(page, from);
    if (chord) await page.keyboard.press(toKeyPressString(chord));
    await expectCellToContainActiveElement(page, to.row, to.col);
  }
}

export async function setCellFocus(
  page: Page,
  from: { row: number; col: number },
): Promise<Locator> {
  const cell = page.getByTestId(`grid-cell-${from.row}-${from.col}`);
  await cell.waitFor();

  // Special case for UI element (e.g nz-input-number)
  const spin = cell.locator('input[role="spinbutton"]');
  if (await spin.count()) {
    await spin.focus();
    return spin;
  }

  // fallback
  await cell.focus();
  return cell;
}

export async function setToolkit(page: Page, toolkitType: ToolkitType) {
  if (toolkitType === 'Vanilla') {
    await page.getByTestId('toolkit-vanilla').click();
  } else {
    await page.getByTestId('toolkit-ngzorro').click();
  }
}

export async function updateFocuslyKeymap(page: Page, keymap: TestKeyMap) {
  await page.evaluate((km) => {
    window.focuslyTestApi?.updateKeymap(km.map);
  }, keymap);
}

export async function expectCellToContainActiveElement(page: Page, row: number, col: number) {
  const expectedId = `grid-cell-${row}-${col}`;

  await expect
    .poll(
      async () => {
        return await page.evaluate((id) => {
          const active = document.activeElement as HTMLElement | null;
          if (!active) return null;

          const cell = active.closest<HTMLElement>('[data-test-id^="grid-cell-"]');
          return cell?.getAttribute('data-test-id') ?? null;
        }, expectedId);
      },
      {
        message: `Expected focus to be inside ${expectedId}`,
      },
    )
    .toBe(expectedId);
}

export function toKeyPressString(keyChord: FocuslyKeyChord | undefined): string {
  if (!keyChord) return '';

  const chord = Array.isArray(keyChord) ? keyChord[0] : keyChord;

  const modifierMap: Record<string, string> = {
    alt: 'Alt',
    ctrl: 'Control',
    control: 'Control',
    shift: 'Shift',
    meta: 'Meta',
  };

  const keyMap: Record<string, string> = {
    arrowup: 'ArrowUp',
    arrowdown: 'ArrowDown',
    arrowleft: 'ArrowLeft',
    arrowright: 'ArrowRight',
    arrowkeyup: 'ArrowUp', // in case your lib uses this form
    arrowkeydown: 'ArrowDown',
    arrowkeyleft: 'ArrowLeft',
    arrowkeyright: 'ArrowRight',
    pageup: 'PageUp',
    pagedown: 'PageDown',
    home: 'Home',
    end: 'End',
  };

  return chord
    .split('+')
    .map((part) => part.trim())
    .map((part) => {
      const lower = part.toLowerCase();
      if (modifierMap[lower]) return modifierMap[lower];
      if (keyMap[lower]) return keyMap[lower];

      // Single letter keys: normalise to uppercase (e.g. "a" -> "A")
      if (lower.length === 1) return lower.toUpperCase();

      // Fallback: return as-is
      return part;
    })
    .join('+');
}

export function toChordArray(keyChord: FocuslyKeyChord | undefined): string[] {
  if (!keyChord) return [];
  return Array.isArray(keyChord) ? keyChord : [keyChord];
}

export async function waitForGridReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');

  await expect(page.locator('[data-test-id="grid"]')).toBeVisible();
  await expect(page.locator('[data-test-id^="grid-cell-"]').first()).toBeVisible();

  await page.waitForTimeout(50);
}
