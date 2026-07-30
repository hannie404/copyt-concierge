// Shared names for pgmq queues and pg_cron jobs. Keep in sync with
// supabase/functions/* and supabase/migrations/*_cron.sql - see SPEC.md §6.

export const QUEUE_NAMES = {
  webhookIngest: "webhook-ingest",
  delistEverywhere: "delist-everywhere",
  publishListing: "publish-listing",
  notifyStatusChange: "notify-status-change",
  authScore: "auth-score",
} as const;

export const CRON_JOB_NAMES = {
  nightlyReprice: "nightly-reprice",
  weeklyPayoutBatch: "weekly-payout-batch",
  dailyReconciliation: "daily-reconciliation",
  slaBreachCheck: "sla-breach-check",
} as const;

export type ItemStatus =
  "received" | "authenticating" | "flagged" | "photographed" | "listed" | "sold" | "paid";

export type Platform = "stockx" | "ebay" | "whatnot" | "pos";
