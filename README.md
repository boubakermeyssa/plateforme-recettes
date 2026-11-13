# Plateforme recettes healthy → vidéos IA

Recettes healthy, chacune avec une vidéo courte générée par IA, filtrées selon le profil de chaque utilisatrice (régime, allergies, goûts, fiche nutritionniste).

Projet du Master No-code / Low-code IA (Decode), mené avec la méthode **BMAD**.

## Stack
- **Front** : Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Base, comptes, fichiers** : Supabase (Postgres + RLS, Auth, Storage), région UE
- **Veille des recettes** : n8n (workflow quotidien)
- **Vidéo** : Veo (Google), appelé par n8n
- **Hébergement** : Vercel

## Documentation (BMAD)
| Document | Rôle |
|---|---|
| [`docs/brief.md`](docs/brief.md) | Project Brief (Analyste) |
| [`docs/prd.md`](docs/prd.md) | PRD : exigences, epics (PM) |
| [`docs/front-end-spec.md`](docs/front-end-spec.md) | Spec UX |
| [`docs/architecture.md`](docs/architecture.md) | Architecture |
| [`docs/stories/`](docs/stories) | Stories (Scrum Master) |

## Installation
```bash
npm install
cp .env.example .env.local   # puis coller la publishable key Supabase
npm run dev                  # http://localhost:3000
npm test                     # tests unitaires (Vitest)
```
Le schéma de base est dans `supabase/migrations/`.

## Déploiement
Vercel est relié au dépôt GitHub :
- push sur `main` → mise en production automatique ;
- chaque Pull Request → URL de prévisualisation (commentée par Vercel sur la PR).

Variables à définir dans Vercel (Settings → Environment Variables) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Sensitive).

## Méthode Git
- `main` : version stable.
- Une branche par story : `story/<numéro>-<nom>` (ex. `story/1.3-onboarding-ecrans-1-2`).
- Un commit clair par étape, puis une Pull Request vers `main` qui reprend les critères d'acceptation de la story.
- Les secrets (`.env.local`) ne sont jamais versionnés.

## Avancement
| Story | Statut |
|---|---|
| 1.1 Initialisation | ✅ |
| 1.2 Supabase et connexion | ✅ |
| 1.3 Onboarding écrans 1-2 | 🔄 en revue (branche) |
| 1.4 Poids, taille et consentement | 🔄 en revue (branche) |
| 1.5 Contraintes, goûts et mode de vie | 🔄 en revue (branche) |
| 1.6 Mon profil et suppression du compte | 🔄 en revue (branche) |
| 1.7 Déploiement Vercel | 🔄 en cours (production vérifiée, redirection et E2E à valider) |
