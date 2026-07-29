import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MOCK_ITEMS } from "@/lib/mock-data";

export default function OpsPhotographyPage() {
  const queue = MOCK_ITEMS.filter((item) => item.status === "authenticating" || item.status === "photographed");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-black">Photography queue</h1>
          <p className="mt-1 text-sm text-brand-gray">{queue.length} items ready for capture.</p>
        </div>
        <Button variant="primary">Upload photos</Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {queue.map((item) => (
          <Card key={item.id} className="flex flex-col gap-3">
            <div className="flex aspect-square items-center justify-center rounded-card bg-brand-grayPill text-xs text-brand-gray">
              No photo yet
            </div>
            <p className="text-sm font-medium text-brand-black">{item.name}</p>
            <p className="text-xs text-brand-gray">{item.sku}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
