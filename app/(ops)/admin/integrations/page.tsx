import { Card } from "@/components/Card";
import { MOCK_INTEGRATIONS } from "@/lib/mock-data";
import { getAdapterMode } from "@/lib/platform-adapter";
import { createClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/queue-names";

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

const PLATFORM_ADAPTER_KEYS: Record<string, Platform> = {
  StockX: "stockx",
  eBay: "ebay",
  Whatnot: "whatnot",
};

// Only the marketplace rows are mock - Supabase Queues/Cron below are real,
// per Phase 11 (BUILD_PROMPTS.md item 3). No live rate-limit data exists for
// StockX/eBay/Whatnot since no adapter ever writes to platform_accounts.
const MARKETPLACE_INTEGRATIONS = MOCK_INTEGRATIONS.filter((i) => i.platform in PLATFORM_ADAPTER_KEYS);

type QueueDepth = { queue_name: string; queue_length: number };
type CronJob = { jobname: string; schedule: string; active: boolean };

async function getInfraHealth() {
  const supabase = await createClient();

  const [{ data: queues }, { data: jobs }] = await Promise.all([
    supabase.rpc("get_queue_depths") as unknown as Promise<{ data: QueueDepth[] | null }>,
    supabase.rpc("get_cron_jobs") as unknown as Promise<{ data: CronJob[] | null }>,
  ]);

  const totalPending = (queues ?? []).reduce((sum, q) => sum + Number(q.queue_length), 0);
  const activeJobs = (jobs ?? []).filter((j) => j.active).length;
  const allJobsActive = (jobs ?? []).length > 0 && activeJobs === jobs!.length;

  return {
    queues: {
      status: queues ? "healthy" : "down",
      detail: queues ? `${totalPending} pending message${totalPending === 1 ? "" : "s"}` : "Unable to reach queues",
    },
    cron: {
      status: jobs && jobs.length > 0 ? (allJobsActive ? "healthy" : "degraded") : "down",
      detail: jobs ? `${activeJobs} / ${jobs.length} jobs active` : "Unable to reach cron",
    },
  };
}

export default async function AdminIntegrationsPage() {
  const infra = await getInfraHealth();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Integrations</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Marketplace connections and Supabase Queue/Cron health.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MARKETPLACE_INTEGRATIONS.map((integration) => {
          const adapterPlatform = PLATFORM_ADAPTER_KEYS[integration.platform];
          const mode = adapterPlatform ? getAdapterMode(adapterPlatform) : null;

          return (
            <Card key={integration.platform} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[integration.status]}`} />
                <div>
                  <p className="font-medium text-brand-black">{integration.platform}</p>
                  <p className="text-xs text-brand-gray">{integration.rateLimit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {mode && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      mode === "mock"
                        ? "bg-status-authenticating/15 text-status-authenticating"
                        : "bg-status-sold/15 text-status-sold"
                    }`}
                  >
                    {mode === "mock" ? "Mock mode" : "Real"}
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-wide text-brand-gray">
                  {STATUS_LABEL[integration.status]}
                </span>
              </div>
            </Card>
          );
        })}

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[infra.queues.status]}`} />
            <div>
              <p className="font-medium text-brand-black">Supabase Queues (pgmq)</p>
              <p className="text-xs text-brand-gray">{infra.queues.detail}</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-brand-gray">
            {STATUS_LABEL[infra.queues.status]}
          </span>
        </Card>

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[infra.cron.status]}`} />
            <div>
              <p className="font-medium text-brand-black">pg_cron</p>
              <p className="text-xs text-brand-gray">{infra.cron.detail}</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-brand-gray">
            {STATUS_LABEL[infra.cron.status]}
          </span>
        </Card>
      </div>
    </div>
  );
}
