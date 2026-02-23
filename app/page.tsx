import { createClient } from "@/lib/supabase/server";
import { CabinGrid } from "@/components/CabinGrid";
import { Hero } from "@/components/Hero";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: cabins, error } = await supabase
    .from("cabins")
    .select("*")
    .order("name");

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-forest-800 mb-6">
          Nuestras Cabañas
        </h2>
        <CabinGrid cabins={(cabins ?? []) as import("@/lib/types").Cabin[]} error={error?.message} />
      </main>
    </div>
  );
}
