# Projet : plateforme recettes healthy → vidéos IA

## Le produit
Une app web qui propose des recettes healthy (et leurs vidéos IA) adaptées au profil
de chaque utilisatrice. Cible : personnes qui veulent perdre du poids,
- soit en **autonomie** (sans professionnel),
- soit **suivies** par un nutritionniste (elles importent leur fiche, qui devient la règle prioritaire).

## Comment je travaille (Meyssa)
- Je débute en code, Git et terminal : explique chaque commande avant de la lancer, pas à pas, en français.
- Réponses courtes. Fais, puis résume en 2-3 lignes ce que tu as fait.
- Avant toute action irréversible (suppression, migration de base en prod, push) : demande-moi.

## Architecture
| Brique | Outil | Rôle |
|---|---|---|
| Veille | **n8n** (workflow existant, tous les jours à 6 h) | Scrape Marmiton + Fourchette & Bikini, extrait la recette (JSON-LD), dédoublonne, note avec Claude, génère un prompt vidéo |
| Base, comptes, fichiers | **Supabase** | Profils, recettes, fiches nutritionniste (bucket privé), vidéos |
| Front | **Next.js (App Router) + TypeScript + Tailwind** | Onboarding, profil, flux de recettes personnalisé |
| Hébergement | **Vercel** | Déploiement |
| Vidéo | **Veo (Google)** via l'API Gemini / Vertex AI, appelée par n8n | Génère la vidéo de chaque recette retenue à partir du prompt |

n8n écrit dans Supabase via l'API REST (clé `service_role` côté n8n uniquement, jamais dans le front).

## Méthode : BMAD
On suit la méthode BMAD. Ordre des documents : `docs/brief.md` → `docs/prd.md` → `docs/front-end-spec.md` → `docs/architecture.md` → `docs/stories/`.
- Ne code que des stories du dossier `docs/stories/`, une à la fois, dans l'ordre.
- Avant de coder : relis la story et ses critères d'acceptation. Après : coche les critères, remplis « Dev Notes / Journal », passe le statut à « Terminée ».
- Si une décision change le PRD ou l'architecture, mets d'abord à jour le document concerné, puis code.

## Méthode Git (exigée par le prof)
- Une branche par story : `story/<numéro>-<nom>`, créée depuis `main`.
- Commits clairs en français, préfixés par la story (« Story 1.3 : … »).
- Pull Request vers `main` par story, avec les critères d'acceptation cochés ; fusion après validation.
- Mettre à jour le tableau « Avancement » du README à chaque story.

## Fichiers de référence (dossier /docs)
- `docs/schema_profil.sql` : schéma Supabase du profil (déjà validé)
- `docs/TP_n8n.json` : workflow de veille actuel
- `docs/TP_n8n_error_handling.json` : workflow d'alerte en cas d'erreur
- Maquettes de l'onboarding : https://claude.ai/artifact/GbbY8KAQAoEizy3a35DJpt

## Profil utilisateur (décisions validées)
- Deux types de profil : `autonome` et `suivi`.
- **Poids et taille** : demandés, mais facultatifs, et enregistrés seulement si la case de consentement santé est cochée (RGPD art. 9 ; contrainte en base).
- **Grossesse / maladie chronique** : ne bloquent pas l'inscription. On affiche un message « parlez-en à un professionnel, nos recettes ne remplacent pas un avis médical ».
- **Fiche nutritionniste** : importée par l'utilisatrice (pas de compte nutritionniste). L'IA extrait les règles (autorisé / à limiter / interdit + portion + fréquence), l'utilisatrice valide avant usage.
- 14 allergènes officiels ; régimes : végétarien, vegan, pescétarien, halal, sans porc, sans gluten, sans lactose.

## Onboarding : 6 écrans (mobile d'abord)
1. Toi et ta santé : prénom, tranche d'âge, grossesse / maladie + message d'alerte
2. Type de profil + objectif
3. Poids et taille (facultatif) + consentement
4. Allergies et régime
5. Goûts et mode de vie : aimés / détestés, temps max, équipement, repas, budget, portions
6. Fiche nutritionniste (profil `suivi` seulement) : import + validation des règles

## Charte visuelle
- Ambiance bien-être, claire et moderne. Police : Plus Jakarta Sans.
- Fond `#F8F4EF` · texte `#24302A` · texte secondaire `#5F6B64`
- Principale (sauge) `#4F7A5A` (survol `#3B5F45`, fond sélection `#EAF2EB`)
- Accent pêche `#E8A38C` (progression, zone d'import) · fond alerte `#FDF0E8`
- Statuts : autorisé `#4F7A5A` · à limiter `#A65F00` · interdit `#B42318`
- Cartes blanches sans bordure, ombre `0 6px 20px rgba(79,122,90,0.08)`, rayon 20 px ; boutons en pilule ; cibles tactiles ≥ 44 px.

## Règles de correspondance recette ↔ profil
- **Exclue** : contient un allergène ou un aliment interdit.
- **À adapter** : contient un aliment « à limiter » → l'IA propose un remplacement.
- **Compatible** : affichée, triée par score de préférence.
- La fiche nutritionniste passe avant les réglages par défaut.

## Garde-fous
- Pas d'objectif calorique chiffré ni de régime extrême ou « détox miracle ».
- Toujours citer et lier la source d'une recette ; ne pas republier texte ni photos d'origine.
- Données de santé : RLS activée partout, chaque utilisatrice ne voit que ses données.
- Jamais de clé secrète dans le code ou dans Git : tout passe par `.env.local` (dans `.gitignore`).

## Plan V1 (dans l'ordre)
1. Initialiser le projet Next.js + Tailwind + Git, pousser sur GitHub
2. Créer le projet Supabase, exécuter `docs/schema_profil.sql`, brancher l'auth (e-mail)
3. Construire les 6 écrans d'onboarding selon les maquettes, enregistrement dans Supabase
4. Page « Mon profil » modifiable
5. Déployer sur Vercel
6. Table `recettes` dans Supabase + bucket `videos` ; adapter le workflow n8n pour écrire dans Supabase au lieu de la Data Table
7. Brancher Veo dans n8n : prompt → génération (asynchrone : lancer, puis vérifier le statut en boucle) → téléchargement → upload dans le bucket `videos` → URL enregistrée sur la recette
8. Moteur de correspondance recette ↔ profil + flux de recettes et vidéos dans l'app
9. Passer les alertes Gmail (succès et erreur) sur l'adresse de Meyssa
