# Architecture

> BMAD · Agent Architecte · v0.1 · 13/11/2026 · Sources : `prd.md`, `front-end-spec.md`

## 1. Vue d'ensemble
```
            ┌──────────── n8n (cron 6 h) ─────────────┐
 Sites  →   │ HTTP → JSON-LD → dédoublonnage → Claude  │
 sources    │   (note + prompt) → note ≥ 5 → Veo       │
            │   (lancer → vérifier → télécharger)      │
            └──────┬───────────────────────┬───────────┘
                   │ REST (service_role)   │ Storage upload
                   ▼                       ▼
            ┌──────────────── Supabase (UE) ───────────┐
            │ Postgres + RLS · Auth · Storage           │
            │ tables profils / regles / recettes        │
            │ buckets : fiches (privé) · videos         │
            └──────────────────┬───────────────────────┘
                               │ supabase-js (clé anon + session)
                               ▼
            ┌──── Next.js sur Vercel ──────────────────┐
            │ App Router · Server Actions · routes API │
            │ /api/fiche/extract → Claude (serveur)    │
            └──────────────────────────────────────────┘
```

## 2. Stack
| Couche | Choix |
|---|---|
| Front | Next.js 15 (App Router), TypeScript, Tailwind CSS, `@supabase/ssr` |
| Validation | Zod (formulaires et réponses IA) |
| Base | Supabase Postgres, RLS |
| Auth | Supabase Auth (lien magique par e-mail) |
| Stockage | Supabase Storage : `fiches` (privé), `videos` (lecture publique) |
| IA texte | Claude (Anthropic API) : extraction de fiche, remplacements ; dans n8n : notation + prompt |
| IA vidéo | Veo via l'API Gemini, appelé par n8n |
| Orchestration | n8n (workflows `TP_n8n` + `error_handling`) |
| Hébergement | Vercel |
| Tests | Vitest, Playwright |

## 3. Modèle de données
Profil : voir `docs/schema_profil.sql` (déjà validé).

À ajouter (E3/E4) :
```sql
create table recettes (
  id                 uuid primary key default gen_random_uuid(),
  url                text unique not null,
  source             text not null,
  nom                text not null,
  categorie          text,
  regimes            text[] default '{}',
  ingredients        text[] not null default '{}',
  ingredients_norm   text[] not null default '{}',  -- noms normalisés pour la correspondance
  allergenes         text[] not null default '{}',
  temps_total_min    integer,
  portions           integer,
  resume             text,
  theme              text,
  note_ia            integer,
  prompt_video       text,
  video_statut       text not null default 'a_generer'
                     check (video_statut in ('a_generer','en_cours','prete','echec','ignoree')),
  video_path         text,
  video_operation_id text,
  created_at         timestamptz not null default now()
);
create index on recettes (video_statut);
create index on recettes using gin (ingredients_norm);
create index on recettes using gin (allergenes);

alter table recettes enable row level security;
create policy "lecture connectée" on recettes for select to authenticated using (true);
-- écriture : uniquement n8n (clé service_role, qui contourne la RLS)
```

## 4. Flux de la veille et de la vidéo (n8n)
1. Cron 6 h → sources (Marmiton, Fourchette & Bikini) → extraction JSON-LD (déjà en place).
2. Dédoublonnage : `GET /rest/v1/recettes?select=url` au lieu de la Data Table.
3. Agent Claude → note, résumé, thème, prompt, allergènes, ingrédients normalisés.
4. `POST /rest/v1/recettes` (upsert sur `url`).
5. Note ≥ 5 et plafond non atteint → `video_statut = en_cours` → appel Veo (opération longue).
6. Boucle Wait (30 s) → vérification du statut de l'opération → au bout de 10 essais : `echec`.
7. Téléchargement du MP4 → upload `videos/{id}.mp4` → `video_statut = prete`, `video_path`.
8. Récapitulatif Gmail ; Error Trigger → alerte Gmail (adresse de Meyssa).

## 5. Correspondance recette ↔ profil
Fonction SQL `recettes_pour_profil(profil_id)`, ou logique serveur en TypeScript au début :
1. **Exclue** si `allergenes ∩ profil_allergies ≠ ∅`, ou si une règle « interdit » correspond à un `ingredients_norm`, ou si la recette est incompatible avec un régime du profil, ou si elle dépasse le temps max.
2. **À adapter** si une règle « à limiter » correspond.
3. **Compatible** sinon.
4. Score = +2 par aliment aimé, −3 par aliment détesté, +1 si le repas est visé. Tri par score décroissant, puis par date.

## 6. Structure du projet
```
plateforme-recettes/
├─ CLAUDE.md
├─ docs/            (brief, prd, front-end-spec, architecture, stories/, schema_profil.sql, workflows n8n)
├─ supabase/migrations/
├─ src/
│  ├─ app/
│  │  ├─ (auth)/connexion/
│  │  ├─ onboarding/[etape]/
│  │  ├─ profil/
│  │  ├─ recettes/ · recettes/[id]/
│  │  └─ api/fiche/extract/route.ts
│  ├─ components/   (ui/ + onboarding/ + recettes/)
│  ├─ lib/          (supabase/, matching.ts, schemas.ts)
│  └─ styles/
├─ tests/           (unit/ + e2e/)
└─ .env.local       (non versionné)
```

## 7. Sécurité et conformité
- RLS partout ; le front utilise uniquement la clé `anon` et la session.
- Clés `service_role`, Anthropic et Gemini : uniquement côté serveur (variables d'environnement Vercel) et dans n8n.
- Bucket `fiches` privé, accès par URL signée de courte durée.
- Consentement santé horodaté ; le retirer efface poids et taille ; supprimer le compte efface tout (cascade + fichiers).
- Projet Supabase en région UE.

## 8. Variables d'environnement
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # serveur uniquement
ANTHROPIC_API_KEY=              # serveur uniquement
```
Dans n8n : identifiants Supabase (service_role), Anthropic, Gemini (Veo), Gmail.
