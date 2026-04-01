# 🔄 TruequeMX v1.0 (MVP)
> Plataforma de economía circular para el estado de Veracruz (Poza Rica, Veracruz Puerto, Papantla).

![TruequeMX Hero](https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2026&auto=format&fit=crop)

## 🚀 Tech Stack
* **Frontend:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS + Framer Motion (Cinematic UI)
* **Icons:** Lucide React
* **Backend/Auth:** Supabase (PostgreSQL)
* **Hosting:** Netlify

## 🛠 Instalación Local
1. Clona el repositorio:
   ```bash
   git clone https://github.com/krisyiser/truequemx.git
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura variables de entorno en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=TU_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## 🔐 Configuración de Base de Datos
Ejecuta el script de migración en `supabase/migrations/20240401000000_init.sql` para crear las tablas:
* `profiles`
* `items`

## 🎨 Diseño Cinematográfico
Basado en una paleta **Emerald Green (#10b981)** y **Dark Mode** por defecto, enfocado en una experiencia de usuario premium y fluida ("Mobile First").

Desarrollado con ❤️ para el estado de Veracruz.
