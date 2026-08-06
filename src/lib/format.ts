export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

export type DeliveryRegion = "ibadan" | "southwest" | "eastern" | "northern";
export type DeliveryMethod = "park-pickup" | "door-step" | "same-day";

export function computeDeliveryFee(
  region: DeliveryRegion,
  method: DeliveryMethod,
  subtotal: number
): number {
  if (region === "ibadan") {
    if (subtotal >= 100000) return 0;
    return method === "same-day" ? 2500 : 2000;
  }
  if (region === "southwest") return method === "park-pickup" ? 6000 : 8000;
  if (region === "eastern") return method === "park-pickup" ? 10000 : 12000;
  return method === "park-pickup" ? 13000 : 15000;
}
