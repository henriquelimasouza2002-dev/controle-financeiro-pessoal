export const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

export function parseAmount(value: unknown) {
  if (typeof value !== "string") return NaN;
  return Number(value.replace(/\./g, "").replace(",", "."));
}
