export function formatCoins(n: string | number | bigint): string {
  const v = typeof n === "bigint" ? n : BigInt(Math.floor(Number(n)));
  return new Intl.NumberFormat("ru-RU").format(v);
}
