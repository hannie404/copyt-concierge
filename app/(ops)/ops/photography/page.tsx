import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/server";
import { uploadItemPhoto } from "@/lib/actions/photography";

async function getPhotographyQueue() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("items")
    .select("id, sku, description, user_id")
    .eq("status", "photographed")
    .order("intake_at", { ascending: true });

  const items = data ?? [];

  return Promise.all(
    items.map(async (item) => {
      const { data: files } = await supabase.storage
        .from("item-photos")
        .list(`${item.user_id}/${item.id}`, { limit: 1, sortBy: { column: "created_at", order: "desc" } });

      let photoUrl: string | null = null;
      if (files && files.length > 0) {
        const { data: signed } = await supabase.storage
          .from("item-photos")
          .createSignedUrl(`${item.user_id}/${item.id}/${files[0].name}`, 60 * 60);
        photoUrl = signed?.signedUrl ?? null;
      }

      return { ...item, photoUrl };
    })
  );
}

export default async function OpsPhotographyPage({
  searchParams,
}: {
  searchParams: Promise<{ uploaded?: string; error?: string }>;
}) {
  const { uploaded, error } = await searchParams;
  const queue = await getPhotographyQueue();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-black">Photography queue</h1>
          <p className="mt-1 text-sm text-brand-gray">{queue.length} items ready for capture.</p>
        </div>
      </div>

      {uploaded && (
        <p className="mt-4 rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
          Photo uploaded.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-card bg-status-flagged/10 px-4 py-3 text-sm text-status-flagged">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {queue.map((item) => (
          <Card key={item.id} className="flex flex-col gap-3">
            {item.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.photoUrl}
                alt={item.description}
                className="aspect-square w-full rounded-card object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-card bg-brand-grayPill text-xs text-brand-gray">
                No photo yet
              </div>
            )}
            <p className="text-sm font-medium text-brand-black">{item.description}</p>
            <p className="text-xs text-brand-gray">{item.sku}</p>
            <form action={uploadItemPhoto} className="flex flex-col gap-2">
              <input type="hidden" name="itemId" value={item.id} />
              <input
                type="file"
                name="photo"
                accept="image/*"
                required
                className="text-xs text-brand-gray file:mr-2 file:rounded-full file:border-0 file:bg-brand-grayPill file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase"
              />
              <Button type="submit" variant="outline" className="px-4 py-1.5 text-xs">
                {item.photoUrl ? "Replace photo" : "Upload"}
              </Button>
            </form>
          </Card>
        ))}
        {queue.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-brand-gray">Queue is empty.</p>
        )}
      </div>
    </div>
  );
}
