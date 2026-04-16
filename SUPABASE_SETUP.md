# Setup Supabase — Festival Missions

## Modes disponibles

| Mode | Stockage | Partage |
|---|---|---|
| `local` | localStorage (par appareil) | Non |
| `supabase` | Base centralisee | Oui |

---

## 1. Creer la table `festival_state`

Coller ce SQL dans **Supabase > SQL Editor** et executer:

```sql
-- Table principale
create table if not exists public.festival_state (
  id        text        primary key,
  payload   jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.festival_state enable row level security;

-- Les participants peuvent LIRE l'etat global
create policy "state_select_public"
  on public.festival_state for select
  using (true);

-- Pour un festival interne : ecriture ouverte (pratique, acceptable)
create policy "state_write_anon"
  on public.festival_state for insert
  with check (true);

create policy "state_update_anon"
  on public.festival_state for update
  using (true) with check (true);
```

> **Production durcie** : remplacer les 2 dernieres policies par celles-ci
> pour que seul un backend serveur (service_role) puisse ecrire :
>
> ```sql
> create policy "state_insert_service"
>   on public.festival_state for insert
>   with check (auth.role() = 'service_role');
>
> create policy "state_update_service"
>   on public.festival_state for update
>   using  (auth.role() = 'service_role')
>   with check (auth.role() = 'service_role');
> ```

---

## 2. Recuperer les cles

**Supabase > Project Settings > API** :

- **Project URL** : `https://xxxxxxxx.supabase.co`
- **anon public key** : `eyJhbGci...`

---

## 3. Configurer orga.html

1. Ouvrir `orga.html` sur votre appareil orga.
2. Onglet **Configuration backend (V2)**.
3. Remplir :
   - Mode : `Supabase (central)`
   - URL : votre URL Supabase
   - Anon key : votre cle anon
   - State row id : `global` (ou nom de votre edition)
4. **Sauvegarder config** → **Publier vers backend**.

---

## 4. Cote participant (index.html)

Au demarrage, `index.html` lit la config depuis `localStorage` et importe automatiquement missions/resultats depuis Supabase. Les participants ne configurent rien.

---

## 5. Payload synchronise

| Cle | Contenu |
|---|---|
| `missions` | Missions actives |
| `suggestions` | Propositions participants |
| `results` | Validations de toutes les sessions |
| `updatedAt` | Timestamp derniere publication |

Restent **toujours locaux** : profil, session ID, progression interne.

---

## 6. Reset entre editions

```sql
delete from public.festival_state where id = 'global';
```

Puis depuis orga.html : **Publier vers backend** pour reinitialiser.
