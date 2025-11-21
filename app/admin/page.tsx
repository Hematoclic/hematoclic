import { createServerSupabase } from "@/utils/supabase/server";
import { LogoutButton } from "../components/logout";

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <h1>Welcome, {session?.user.email}</h1>
      <LogoutButton />
    </div>
  );
}
