export type FocuslyItem = FocuslyTargetItem | FocuslyCellItem;

export type FocuslyTargetItem = {
  id: string;
  groupId: number;
};

export type FocuslyCellItem = FocuslyTargetItem & {
  row: number;
  column: number;
};

export function isCellItem(x: FocuslyItem): x is FocuslyCellItem {
  return (x as any).row != null && (x as any).column != null;
}