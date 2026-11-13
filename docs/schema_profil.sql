-- ============================================================
-- Plateforme recettes healthy → vidéos IA
-- Schéma Supabase V1 : PROFIL UTILISATEUR
-- ============================================================

-- ---------- Types ----------
create type type_profil as enum ('autonome', 'suivi');
create type objectif_type as enum ('perdre_poids', 'reequilibrer', 'maintenir');
create type tranche_age as enum ('18-25', '26-35', '36-45', '46-55', '56+');
create type statut_regle as enum ('autorise', 'a_limiter', 'interdit');

-- ---------- 1. Profil ----------
create table profils (
  id                 uuid primary key references auth.users(id) on delete cascade,
  prenom             text not null,
  tranche_age        tranche_age,
  type_profil        type_profil not null default 'autonome',
  objectif           objectif_type not null default 'perdre_poids',

  -- Données de santé (RGPD art. 9 : consentement explicite obligatoire)
  poids_kg           numeric(5,1) check (poids_kg between 30 and 300),
  taille_cm          integer      check (taille_cm between 120 and 230),
  consentement_sante boolean not null default false,
  consentement_date  timestamptz,

  -- Signalements de santé : n'excluent pas, affichent une alerte "consultez un pro"
  alerte_grossesse   boolean not null default false,
  alerte_maladie     text[]  not null default '{}',   -- ex : {'diabete','renal'}

  -- Mode de vie
  temps_max_min      integer default 30,
  budget             text check (budget in ('petit','moyen','large')),
  portions           integer default 1 check (portions between 1 and 8),
  equipements        text[] not null default '{}',     -- {'four','air_fryer','micro_ondes'}
  repas_vises        text[] not null default '{dejeuner,diner}',

  onboarding_termine boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- Pas de poids/taille sans consentement
  constraint sante_si_consentement
    check (consentement_sante or (poids_kg is null and taille_cm is null))
);

-- ---------- 2. Contraintes strictes ----------
create table profil_allergies (
  profil_id uuid references profils(id) on delete cascade,
  allergene text not null check (allergene in (
    'gluten','crustaces','oeufs','poissons','arachides','soja','lait',
    'fruits_a_coque','celeri','moutarde','sesame','sulfites','lupin','mollusques')),
  primary key (profil_id, allergene)
);

create table profil_regimes (
  profil_id uuid references profils(id) on delete cascade,
  regime    text not null check (regime in (
    'vegetarien','vegan','halal','sans_porc','sans_gluten','sans_lactose','pescetarien')),
  primary key (profil_id, regime)
);

-- ---------- 3. Préférences ----------
create table profil_preferences (
  id        bigint generated always as identity primary key,
  profil_id uuid references profils(id) on delete cascade,
  type      text not null check (type in ('aliment_aime','aliment_deteste','cuisine_preferee')),
  valeur    text not null,
  unique (profil_id, type, valeur)
);

-- ---------- 4. Fiche nutritionniste (profil "suivi") ----------
create table fiches_nutritionniste (
  id               uuid primary key default gen_random_uuid(),
  profil_id        uuid references profils(id) on delete cascade,
  fichier_path     text not null,               -- chemin dans Supabase Storage (bucket privé)
  extraction_brute jsonb,                       -- sortie de l'IA
  validee          boolean not null default false,  -- l'utilisatrice relit avant usage
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

-- Règles extraites de la fiche (ou saisies à la main)
create table regles_alimentaires (
  id        bigint generated always as identity primary key,
  profil_id uuid references profils(id) on delete cascade,
  fiche_id  uuid references fiches_nutritionniste(id) on delete cascade,
  aliment   text not null,
  statut    statut_regle not null,
  portion   text,          -- ex : "150 g max"
  frequence text,          -- ex : "2 fois / semaine"
  unique (profil_id, aliment)
);

-- ---------- updated_at automatique ----------
create or replace function maj_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger profils_updated before update on profils
  for each row execute function maj_updated_at();

-- ---------- Sécurité : chaque utilisatrice ne voit que ses données ----------
alter table profils               enable row level security;
alter table profil_allergies      enable row level security;
alter table profil_regimes        enable row level security;
alter table profil_preferences    enable row level security;
alter table fiches_nutritionniste enable row level security;
alter table regles_alimentaires   enable row level security;

create policy "own" on profils               for all using (id = auth.uid())        with check (id = auth.uid());
create policy "own" on profil_allergies      for all using (profil_id = auth.uid()) with check (profil_id = auth.uid());
create policy "own" on profil_regimes        for all using (profil_id = auth.uid()) with check (profil_id = auth.uid());
create policy "own" on profil_preferences    for all using (profil_id = auth.uid()) with check (profil_id = auth.uid());
create policy "own" on fiches_nutritionniste for all using (profil_id = auth.uid()) with check (profil_id = auth.uid());
create policy "own" on regles_alimentaires   for all using (profil_id = auth.uid()) with check (profil_id = auth.uid());
