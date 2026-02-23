"use client";

import type { Booking } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

type BookingsTableProps = {
  bookings: (Booking & { cabins?: { name: string } | null })[];
  error?: string;
};

export function BookingsTable({ bookings: initialBookings, error }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    setUpdatingId(id);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (updateError) throw updateError;
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch {
      // podrías mostrar toast
    } finally {
      setUpdatingId(null);
    }
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
        No se pudieron cargar las reservas.
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <p className="text-nature-600">No hay reservas aún.</p>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-nature-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-nature-100 text-forest-800">
            <tr>
              <th className="px-4 py-3 font-medium">Cabaña</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Entrada</th>
              <th className="px-4 py-3 font-medium">Salida</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nature-200">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-nature-50/50">
                <td className="px-4 py-3">{b.cabins?.name ?? "-"}</td>
                <td className="px-4 py-3">{b.customer_name}</td>
                <td className="px-4 py-3">{b.customer_phone}</td>
                <td className="px-4 py-3">
                  {format(new Date(b.check_in), "dd/MM/yyyy", { locale: es })}
                </td>
                <td className="px-4 py-3">
                  {format(new Date(b.check_out), "dd/MM/yyyy", { locale: es })}
                </td>
                <td className="px-4 py-3">
                  ${Number(b.total_price).toLocaleString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-sm ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {b.status === "pending"
                      ? "Pendiente"
                      : b.status === "confirmed"
                      ? "Confirmada"
                      : "Cancelada"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={updatingId === b.id}
                        onClick={() => updateStatus(b.id, "confirmed")}
                        className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === b.id}
                        onClick={() => updateStatus(b.id, "cancelled")}
                        className="text-sm px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
