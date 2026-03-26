import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <DashboardClient
        user={{ id: "guest", email: "" }}
      />
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email ?? "" }}
    />
  );
}
