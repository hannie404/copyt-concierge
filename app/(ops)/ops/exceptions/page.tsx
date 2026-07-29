import { Card } from "@/components/Card";
import { MOCK_EXCEPTIONS } from "@/lib/mock-data";

export default function OpsExceptionsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Exceptions</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Items flagged for suspected counterfeit, damage, or barcode mismatch.
      </p>

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {MOCK_EXCEPTIONS.map((exc) => (
            <div key={exc.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium text-brand-black">{exc.item}</p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-status-flagged">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-flagged" />
                  {exc.reason}
                </p>
              </div>
              <div className="text-right text-xs text-brand-gray">
                <p>Flagged {exc.flaggedAt}</p>
                <p>by {exc.flaggedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
