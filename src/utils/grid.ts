export function computeGridItemSize(
  windowWidth: number,
  containerPaddingHorizontal: number,
  gap: number,
  columns: number = 3,
): number {
  const totalGap = gap * (columns - 1);
  const available = windowWidth - containerPaddingHorizontal * 2 - totalGap;
  return Math.floor(available / columns);
}


