import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Loads .env.local manually since this runs via plain `node`, not Next.js.
const envContent = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
for (const rawLine of envContent.split("\n")) {
  const line = rawLine.replace(/\r$/, "");
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const DEMO_EMAIL = "demo.consignor@copyt-concierge.test";

// Minimal inline mock-publish, matching lib/platform-adapter.ts's
// MockPlatformAdapter.publish() shape - this plain Node script can't import
// that TS file directly, so it's a small duplicate for exactly one call site.
function mockPublish(platform, sku) {
  return `MOCK-${platform}-${sku}-${Math.random().toString(36).slice(2, 8)}`;
}

async function getOrCreateDemoConsignor() {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing.users.find((u) => u.email === DEMO_EMAIL);
  if (found) return found.id;

  const { data, error } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: "DemoPass123!",
    email_confirm: true,
    user_metadata: { name: "Demo Consignor" },
  });
  if (error) throw error;
  return data.user.id;
}

async function main() {
  const userId = await getOrCreateDemoConsignor();
  console.log("Demo consignor:", userId, `(${DEMO_EMAIL} / DemoPass123!)`);

  const items = [
    { desc: "Nike Air Force 1 '07", status: "received", value: 110 },
    { desc: "Adidas Samba OG", status: "received", value: 95 },
    { desc: "Rolex Submariner Date", status: "authenticating", value: 12500 },
    { desc: "Chanel Classic Flap Bag", status: "authenticating", value: 6800 },
    { desc: "Off-White x Nike Dunk Low", status: "flagged", value: 340 },
    { desc: "Supreme x Louis Vuitton Trunk", status: "photographed", value: 4200 },
    { desc: "Yeezy Boost 350 V2 'Zebra'", status: "photographed", value: 220 },
    { desc: "Air Jordan 1 Retro High 'Chicago'", status: "listed", value: 450, platforms: ["stockx", "ebay", "whatnot"] },
    { desc: "Cartier Tank Louis", status: "listed", value: 3100, platforms: ["stockx", "ebay"] },
    { desc: "Travis Scott x Air Jordan 6", status: "sold", value: 680, salePlatform: "stockx", salePrice: 655 },
  ];

  for (const [i, item] of items.entries()) {
    const sku = `DEMO-SKU-${String(i + 1).padStart(3, "0")}`;
    const barcode = `DEMO-BC-${String(i + 1).padStart(3, "0")}`;

    const { data: inserted, error } = await supabase
      .from("items")
      .insert({
        user_id: userId,
        sku,
        barcode,
        description: item.desc,
        status: item.status === "sold" ? "sold" : item.status,
        estimated_value: item.value,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        console.log(`Skipping ${sku} (already seeded)`);
        continue;
      }
      throw error;
    }

    const itemId = inserted.id;

    if (item.platforms) {
      for (const platform of item.platforms) {
        await supabase.from("listings").insert({
          item_id: itemId,
          platform,
          price: item.value,
          status: "active",
          external_id: mockPublish(platform, sku),
        });
      }
    }

    if (item.status === "sold") {
      const { data: listing } = await supabase
        .from("listings")
        .insert({
          item_id: itemId,
          platform: item.salePlatform,
          price: item.salePrice,
          status: "sold",
          external_id: mockPublish(item.salePlatform, sku),
        })
        .select("id")
        .single();

      await supabase.from("sales").insert({
        item_id: itemId,
        listing_id: listing.id,
        platform: item.salePlatform,
        sale_price: item.salePrice,
      });

      await supabase.from("payouts").insert({
        user_id: userId,
        amount: item.salePrice,
        batch_id: `seed_${sku}`,
        status: "paid",
        paid_at: new Date().toISOString(),
      });

      await supabase.from("items").update({ status: "paid" }).eq("id", itemId);
    }

    console.log(`Seeded: ${item.desc} (${item.status})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
