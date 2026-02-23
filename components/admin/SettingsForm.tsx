"use client";

import type { Settings } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

type SettingsFormProps = {
  settings: Settings | null;
  error?: string;
};

export function SettingsForm({ settings: initialSettings, error }: SettingsFormProps) {
  const [contactPhone, setContactPhone] = useState("");
  const [paymentAlias, setPaymentAlias] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setContactPhone(initialSettings.contact_phone ?? "");
      setPaymentAlias(initialSettings.payment_alias ?? "");
      setBusinessName(initialSettings.business_name ?? "");
    }
  }, [initialSettings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const supabase = createClient();
      const payload = {
        contact_phone: contactPhone.trim() || null,
        payment_alias: paymentAlias.trim() || null,
        business_name: businessName.trim() || null,
        updated_at: new Date().toISOString(),
      };
      if (initialSettings?.id) {
        const { error: updateError } = await supabase
          .from("settings")
          .update(payload)
          .eq("id", initialSettings.id);
        if (updateError) throw updateError;
      } else {
        await supabase.from("settings").insert(payload);
      }
      setSuccess(true);
    } catch {
      // mostrar error
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
        No se pudo cargar la configuración.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-nature-200 p-6 max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="bg-green-50 text-green-800 text-sm px-4 py-3 rounded-lg">
            Configuración guardada correctamente.
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-forest-800 mb-1">
            Teléfono de contacto
          </label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+54 9 11 1234-5678"
            className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest-800 mb-1">
            CBU / Alias (para transferencia)
          </label>
          <input
            type="text"
            value={paymentAlias}
            onChange={(e) => setPaymentAlias(e.target.value)}
            placeholder="ALIAS.O.NUMERO"
            className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest-800 mb-1">
            Nombre del negocio
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Cabañas del Lago"
            className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Guardar configuración"}
        </button>
      </form>
    </div>
  );
}
