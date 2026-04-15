# V2 Backend Setup (Supabase)

Ce projet supporte maintenant 2 modes:

- `local`: stockage localStorage (par appareil)
- `supabase`: source de donnees centrale partagee

## 1) Creer la table `festival_state`

Executer ce SQL dans Supabase SQL Editor:

```sql
create table if not exists public.festival_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.festival_state enable row level security;

-- Politique simple V1 (anon peut lire/ecrire)
-- A renforcer ensuite avec auth si besoin.
create policy if not exists "festival_state_select"
on public.festival_state
for select
using (true);

create policy if not exists "festival_state_insert"
on public.festival_state
for insert
with check (true);

create policy if not exists "festival_state_update"
on public.festival_state
for update
using (true)
with check (true);
```

## 2) Recuperer les informations Supabase

Dans Supabase -> Project Settings -> API:

- Project URL
- anon public key

## 3) Configurer ORGA

Ouvrir `orga.html` puis dans le panneau `Configuration backend (V2)`:

- Mode donnees: `Supabase (central)`
- Supabase URL: `https://xxxx.supabase.co`
- Supabase anon key: `eyJ...`
- State row id: `global` (ou autre identifiant de lot)

Cliquer:

- `Sauvegarder config`
- `Publier vers backend` (premiere publication)

## 4) Cote participant (`index.html`)

L'app lit automatiquement la meme config `festival_backend_config` dans localStorage.
Au demarrage, elle tente un import depuis Supabase puis continue normalement.

## 5) Donnees synchronisees

La V2 synchronise ce payload:

- `missions`
- `suggestions`
- `results`

Le profil, la session et la progression interne restent locaux.

## 6) Limites V1

- Cle anon + politiques ouvertes = pratique pour test, pas securise production.
- Pour production, ajouter auth ORGA et policies strictes.
