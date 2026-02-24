export type FocuslyItem = FocuslyTargetItem | FocuslyCellItem;

export type FocuslyTargetItem = {
  id: string;
  groupId: number;
};

export type FocuslyCellItem = FocuslyTargetItem & {
  row: number;
  column: number;
};

export type FocusRequest = {
  requestId: string;
  id: string;
  groupId?: number;
  preventScroll?: boolean;
  // optional: whether to keep retrying until visible
  waitForVisible?: boolean;
  timeoutMs?: number;
};

export type FocusAck = {
  requestId: string;
  id: string;
  groupId?: number;
  success: boolean;
  reason?: 'not-found' | 'not-visible' | 'not-focusable' | 'timeout';
};

export function isCellItem(x: FocuslyItem): x is FocuslyCellItem {
  return (x as any).row != null && (x as any).column != null;
}
