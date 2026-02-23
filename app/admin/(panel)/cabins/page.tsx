import { createClient } from "@/lib/supabase/server";
import { CabinsManager } from "@/components/admin/CabinsManager";

export default async function AdminCabinsPage() {
  const supabase = await createClient();
  const { data: cabins, error } = await supabase
    .from("cabins")
    .select("*")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest-800 mb-6">
        Gestión de Cabañas
      </h1>
      <CabinsManager
        cabins={(cabins ?? []) as import("@/lib/types").Cabin[]}
        error={error?.message}
      />
    </div>
  );
}
