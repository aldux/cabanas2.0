import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest-800 mb-6">
        Configuración
      </h1>
      <SettingsForm
        settings={settings as import("@/lib/types").Settings | null}
        error={error?.message}
      />
    </div>
  );
}
