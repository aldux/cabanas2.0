import { createClient } from "@/lib/supabase/server";
import { BookingsTable } from "@/components/admin/BookingsTable";

export default async function AdminReservasPage() {
  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, cabins(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest-800 mb-6">Reservas</h1>
      <BookingsTable
        bookings={(bookings ?? []) as import("@/lib/types").Booking[]}
        error={error?.message}
      />
    </div>
  );
}
