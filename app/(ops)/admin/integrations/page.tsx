import { Card } from "@/components/Card";
import { MOCK_INTEGRATIONS } from "@/lib/mock-data";

const STATUS_DOT: Record<string, string> = {
  healthy: "bg-status-sold",
  degraded: "bg-status-authenticating",
  down: "bg-status-flagged",
};

const STATUS_LABEL: Record<string, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

export default function AdminIntegrationsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Integrations</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Marketplace connections and Supabase Queue/Cron health.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MOCK_INTEGRATIONS.map((integration) => (
          <Card key={integration.platform} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[integration.status]}`} />
              <div>
                <p className="font-medium text-brand-black">{integration.platform}</p>
                <p className="text-xs text-brand-gray">{integration.rateLimit}</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-brand-gray">
              {STATUS_LABEL[integration.status]}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
