import { Card } from "@/components/Card";
import { MOCK_SALES } from "@/lib/mock-data";

export default function OpsSoldPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Sold feed</h1>
      <p className="mt-1 text-sm text-brand-gray">Live sales and delist-everywhere confirmation status.</p>

      <div className="mt-6 space-y-4">
        {MOCK_SALES.map((sale) => (
          <Card key={sale.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-brand-black">{sale.item}</p>
                <p className="text-xs text-brand-gray">
                  Sold on <span className="text-status-listed">{sale.platform}</span> · {sale.soldAt}
                </p>
              </div>
              <p className="font-display text-lg font-extrabold text-brand-black">
                ${sale.price.toLocaleString()}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {sale.delisted.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-grayPill px-3 py-1 text-xs font-medium text-brand-black"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-status-sold" />
                  Delisted from {platform}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
