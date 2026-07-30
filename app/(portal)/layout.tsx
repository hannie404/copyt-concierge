import { PortalShell } from "@/components/portal/PortalShell";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "Consignor";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    userName = profile?.name || user.email || "Consignor";
  }

  return <PortalShell userName={userName}>{children}</PortalShell>;
}
