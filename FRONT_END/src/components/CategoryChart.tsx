import { formatMoney } from "@/lib/format";

type Item = { name: string; color: string; total: number };

export function CategoryChart({ items }: { items: Item[] }) {
  const max = Math.max(...items.map((item) => item.total), 1);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  let start = 0;
  const pieParts = items.map((item) => {
    const size = total ? (item.total / total) * 100 : 0;
    const part = `${item.color} ${start}% ${start + size}%`;
    start += size;
    return part;
  });

  return (
    <div>
      <div className="pie" style={{ background: `conic-gradient(${pieParts.join(", ") || "#e5e7eb 0 100%"})` }} />
      <div className="bars">
        {items.length === 0 && <p className="notice">Nenhuma transacao encontrada.</p>}
        {items.map((item) => (
          <div className="bar-line" key={item.name}>
            <div className="bar-label">
              <span>
                <i className="color-dot" style={{ background: item.color }} />
                {item.name}
              </span>
              <strong>{formatMoney(item.total)}</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ background: item.color, width: `${(item.total / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
