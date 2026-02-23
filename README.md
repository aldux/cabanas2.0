# Reservas de Cabañas

Aplicación web de reservas de cabañas con Next.js 14 (App Router), TypeScript, Tailwind CSS y Supabase.

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)

## Configuración

1. **Clonar e instalar dependencias**

   ```bash
   npm install
   ```

2. **Supabase**

   - Crear un proyecto en Supabase.
   - En el **SQL Editor**, ejecutar todo el contenido del archivo `supabase/schema.sql`.
   - En Authentication > Providers, dejar habilitado Email.
   - Crear un usuario desde Authentication > Users (o registrarse desde la app si tenés registro).
   - Marcar un usuario como admin: en el SQL Editor ejecutar (reemplazando `TU_USER_ID` por el UUID del usuario):

   ```sql
   UPDATE public.profiles SET is_admin = true WHERE id = 'TU_USER_ID';
   ```

3. **Variables de entorno**

   - Copiar `.env.local.example` a `.env.local`.
   - Completar con la URL y la anon key de tu proyecto Supabase (Settings > API).

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

- **Página principal:** listado de cabañas y reserva (modal con nombre, teléfono, fechas; se muestra el total y datos de pago desde Configuración).
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (requiere login con usuario con `is_admin: true`).
  - **Reservas:** ver reservas y cambiar estado (Confirmar / Cancelar).
  - **Cabañas:** crear, editar y borrar cabañas.
  - **Configuración:** teléfono de contacto, CBU/Alias y nombre del negocio.

## Build

```bash
npm run build
npm start
```

## Estructura relevante

- `supabase/schema.sql` – Esquema SQL para Supabase (tablas, RLS, trigger de perfiles).
- `lib/supabase/` – Cliente browser, servidor y helper para middleware.
- `app/` – Rutas: `/` (pública), `/admin/login`, `/admin` (panel protegido).
- `components/` – Hero, grid de cabañas, modal de reserva, componentes de admin.
