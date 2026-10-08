const ROUTE_COLORS = [
  '#0066ff',
  '#e45745',
  '#7355bd',
  '#008f75',
  '#d18a00',
  '#bd4e83',
];

export function getRouteColor(index) {
  return ROUTE_COLORS[index % ROUTE_COLORS.length];
}
