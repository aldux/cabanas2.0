"use client";

import type { Cabin } from "@/lib/types";
import { BookingModal } from "./BookingModal";
import { useState } from "react";

type CabinGridProps = {
  cabins: Cabin[];
  error?: string;
};

export function CabinGrid({ cabins, error }: CabinGridProps) {
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
        No se pudieron cargar las cabañas. Revisá la conexión o configuración de Supabase.
      </div>
    );
  }

  if (!cabins.length) {
    return (
      <p className="text-nature-600">
        Aún no hay cabañas cargadas. Agregá alguna desde el panel de administración.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabins.map((cabin) => (
          <article
            key={cabin.id}
            className="bg-white rounded-xl shadow-md border border-nature-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="aspect-[4/3] bg-nature-200 relative overflow-hidden">
              {cabin.image_url ? (
                <img
                  src={cabin.image_url}
                  alt={cabin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-nature-500 text-4xl">
                  🏠
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-forest-800 text-lg">{cabin.name}</h3>
              {cabin.description && (
                <p className="text-nature-600 text-sm mt-1 line-clamp-2">
                  {cabin.description}
                </p>
              )}
              <div className="flex justify-between items-center mt-3">
                <span className="text-forest-600 font-medium">
                  ${cabin.price_per_night.toLocaleString("es-AR")}/noche
                </span>
                <span className="text-nature-500 text-sm">
                  Hasta {cabin.max_capacity} personas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCabin(cabin)}
                className="mt-4 w-full py-2.5 bg-forest-600 text-white font-medium rounded-lg hover:bg-forest-700 transition"
              >
                Reservar
              </button>
            </div>
          </article>
        ))}
      </div>
      {selectedCabin && (
        <BookingModal
          cabin={selectedCabin}
          onClose={() => setSelectedCabin(null)}
        />
      )}
    </>
  );
}
