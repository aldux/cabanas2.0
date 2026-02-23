"use client";

import type { Cabin } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

type CabinsManagerProps = {
  cabins: Cabin[];
  error?: string;
};

const emptyCabin = {
  name: "",
  description: "",
  price_per_night: "",
  max_capacity: "2",
  image_url: "",
  amenities: "",
};

export function CabinsManager({ cabins: initialCabins, error }: CabinsManagerProps) {
  const [cabins, setCabins] = useState(initialCabins);
  const [form, setForm] = useState(emptyCabin);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function resetForm() {
    setForm(emptyCabin);
    setEditingId(null);
    setActionError(null);
  }

  function startEdit(cabin: Cabin) {
    setForm({
      name: cabin.name,
      description: cabin.description ?? "",
      price_per_night: String(cabin.price_per_night),
      max_capacity: String(cabin.max_capacity),
      image_url: cabin.image_url ?? "",
      amenities: Array.isArray(cabin.amenities) ? cabin.amenities.join(", ") : "",
    });
    setEditingId(cabin.id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price_per_night: Number(form.price_per_night),
        max_capacity: Number(form.max_capacity),
        image_url: form.image_url.trim() || null,
        amenities: form.amenities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editingId) {
        const { error: updateError } = await supabase
          .from("cabins")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
        setCabins((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
        );
      } else {
        const { data, error: insertError } = await supabase
          .from("cabins")
          .insert(payload)
          .select()
          .single();
        if (insertError) throw insertError;
        setCabins((prev) => [...prev, data as Cabin]);
      }
      resetForm();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta cabaña?")) return;
    setLoading(true);
    setActionError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("cabins").delete().eq("id", id);
      if (deleteError) throw deleteError;
      setCabins((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
        No se pudieron cargar las cabañas.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-nature-200 p-6">
        <h2 className="font-medium text-forest-800 mb-4">
          {editingId ? "Editar cabaña" : "Nueva cabaña"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          {actionError && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {actionError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-forest-800 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-800 mb-1">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1">
                Precio por noche *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price_per_night}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price_per_night: e.target.value }))
                }
                required
                className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-800 mb-1">
                Capacidad máxima *
              </label>
              <input
                type="number"
                min="1"
                value={form.max_capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, max_capacity: e.target.value }))
                }
                required
                className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-800 mb-1">
              URL de imagen
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-800 mb-1">
              Comodidades (separadas por coma)
            </label>
            <input
              type="text"
              value={form.amenities}
              onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
              placeholder="WiFi, Aire acondicionado, Cocina"
              className="w-full px-4 py-2 rounded-lg border border-nature-300 focus:ring-2 focus:ring-forest-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-60"
            >
              {loading ? "Guardando…" : editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-nature-300 rounded-lg hover:bg-nature-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-nature-200 overflow-hidden">
        <h2 className="font-medium text-forest-800 p-4 border-b border-nature-200">
          Cabañas existentes
        </h2>
        {!cabins.length ? (
          <p className="p-4 text-nature-600">No hay cabañas cargadas.</p>
        ) : (
          <ul className="divide-y divide-nature-200">
            {cabins.map((cabin) => (
              <li
                key={cabin.id}
                className="flex items-center justify-between p-4 hover:bg-nature-50/50"
              >
                <div className="flex items-center gap-4">
                  {cabin.image_url ? (
                    <img
                      src={cabin.image_url}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-nature-200 rounded-lg flex items-center justify-center text-2xl">
                      🏠
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-forest-800">{cabin.name}</p>
                    <p className="text-sm text-nature-600">
                      ${Number(cabin.price_per_night).toLocaleString("es-AR")}/noche ·{" "}
                      {cabin.max_capacity} personas
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(cabin)}
                    className="px-3 py-1.5 text-sm border border-forest-600 text-forest-600 rounded-lg hover:bg-forest-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cabin.id)}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-60"
                  >
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
