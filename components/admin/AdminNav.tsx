"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const tabs = [
  { href: "/admin", label: "Reservas" },
  { href: "/admin/cabins", label: "Cabañas" },
  { href: "/admin/settings", label: "Configuración" },
];

export function AdminNav() {
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-56 bg-forest-800 text-white flex flex-col">
      <div className="p-4 border-b border-forest-700">
        <Link href="/admin" className="font-semibold text-lg">
          Panel Admin
        </Link>
      </div>
      <nav className="flex-1 p-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`block px-4 py-2.5 rounded-lg mb-1 transition ${
              pathname === tab.href
                ? "bg-forest-600 text-white"
                : "text-forest-200 hover:bg-forest-700 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-forest-700">
        <Link
          href="/"
          className="block px-4 py-2.5 rounded-lg text-forest-200 hover:bg-forest-700 hover:text-white mb-1"
        >
          Ver sitio
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg text-forest-200 hover:bg-forest-700 hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
