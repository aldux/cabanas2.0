"use client";

import type { Cabin } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { differenceInDays, format, parseISO } from "date-fns";
import { useState, useEffect } from "react";

type BookingModalProps = {
  cabin: Cabin;
  onClose: () => void;
};

export function BookingModal({ cabin, onClose }: BookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<{
    contact_phone: string | null;
    payment_alias: string | null;
    business_name: string | null;
  } | null>(null);

  const nights =
    checkIn && checkOut
      ? Math.max(0, differenceInDays(parseISO(checkOut), parseISO(checkIn)))
      : 0;
  const totalPrice = nights * Number(cabin.price_per_night);
  const isValidDates =
    checkIn &&
    checkOut &&
    parseISO(checkOut) > parseISO(checkIn);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("settings")
          .select("contact_phone, payment_alias, business_name")
          .limit(1)
          .single();
        setSettings(data ?? null);
      } catch {
        setSettings(null);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidDates) {
      setError("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("bookings").insert({
        cabin_id: cabin.id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        status: "pending",
      });
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Error al enviar la reserva. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-forest-800 mb-2">
            Reserva enviada
          </h3>
          <p className="text-nature-600 mb-6">
            Te contactaremos para confirmar. Abajo los datos para realizar el pago.
          </p>
          <div className="bg-nature-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="font-medium text-forest-800">
              Total: ${totalPrice.toLocaleString("es-AR")}
            </p>
            {settings?.contact_phone && (
              <p>
                <span className="text-nature-600">Teléfono: </span>
                {settings.contact_phone}
              </p>
            )}
            {settings?.payment_alias && (
              <p>
                <span className="text-nature-600">CBU/Alias: </span>
                <strong>{settings.payment_alias}</strong>
              </p>
            )}
            {settings?.business_name && (
              <p className="text-sm text-nature-600">{settings.business_name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-forest-600 text-white font-medium rounded-lg hover:bg-forest-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-forest-800">
            Reservar: {cabin.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-nature-500 hover:text-forest-700 text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-forest-800 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-800 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1">
                Entrada *
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1">
                Salida *
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                min={checkIn || undefined}
                className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
              />
            </div>
          </div>
          {nights > 0 && (
            <p className="text-sm text-nature-600">
              {nights} {nights === 1 ? "noche" : "noches"} × $
              {cabin.price_per_night.toLocaleString("es-AR")} ={" "}
              <strong className="text-forest-800">
                ${totalPrice.toLocaleString("es-AR")}
              </strong>
            </p>
          )}
          {!isValidDates && checkIn && checkOut && (
            <p className="text-sm text-amber-600">
              La fecha de salida debe ser posterior a la de entrada.
            </p>
          )}
          {loadingSettings ? (
            <p className="text-sm text-nature-500">Cargando datos de pago…</p>
          ) : settings && (settings.contact_phone || settings.payment_alias) ? (
            <div className="bg-nature-50 rounded-lg p-3 text-sm text-nature-700">
              <p className="font-medium text-forest-800 mb-1">Datos para transferencia:</p>
              {settings.contact_phone && <p>Tel: {settings.contact_phone}</p>}
              {settings.payment_alias && (
                <p>
                  CBU/Alias: <strong>{settings.payment_alias}</strong>
                </p>
              )}
            </div>
          ) : null}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-nature-300 text-forest-800 font-medium rounded-lg hover:bg-nature-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !isValidDates}
              className="flex-1 py-2.5 bg-forest-600 text-white font-medium rounded-lg hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando…" : "Confirmar reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
