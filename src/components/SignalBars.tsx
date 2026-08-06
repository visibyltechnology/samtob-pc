export default function SignalBars({ stock }: { stock: number }) {
  let level = 4;
  let label = "In stock";
  if (stock <= 0) {
    level = 0;
    label = "Out of stock";
  } else if (stock <= 2) {
    level = 1;
    label = "Low stock";
  } else if (stock <= 5) {
    level = 2;
    label = `${stock} left`;
  } else if (stock <= 9) {
    level = 3;
    label = "Good stock";
  } else {
    level = 4;
    label = "Strong stock";
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`signal-bars ${level > 0 ? `active-${level}` : ""}`}>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="text-xs font-data text-steel">{label}</span>
    </div>
  );
}
