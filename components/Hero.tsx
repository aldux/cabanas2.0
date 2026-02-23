"use client";

import { useState } from "react";

export function Hero() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  return (
    <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-forest-950/50" />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          Cabañas en la Naturaleza
        </h1>
        <p className="text-lg md:text-xl text-nature-100 mb-8 drop-shadow">
          Tu escapada perfecta. Reservá fechas y descubrí disponibilidad.
        </p>
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl max-w-xl mx-auto text-forest-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-left text-sm font-medium mb-1">
                Entrada
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-nature-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-medium mb-1">
                Salida
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-nature-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-medium mb-1">
                Personas
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-nature-200 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-nature-600 mt-3">
            Seleccioná fechas y hacé clic en &quot;Reservar&quot; en la cabaña que te guste.
          </p>
        </div>
      </div>
    </section>
  );
}
