import { getItemsForCurrentUser } from "@/lib/data/items";
import { ItemsFilterClient } from "@/components/portal/ItemsFilterClient";

export default async function ItemsPage() {
  const items = await getItemsForCurrentUser();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Items</h1>
      <ItemsFilterClient items={items} />
    </div>
  );
}
