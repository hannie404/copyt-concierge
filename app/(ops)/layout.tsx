import { OpsShell } from "@/components/ops/OpsShell";
import { createClient } from "@/lib/supabase/server";

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "Staff";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    userName = profile?.name || user.email || "Staff";
  }

  return <OpsShell userName={userName}>{children}</OpsShell>;
}
