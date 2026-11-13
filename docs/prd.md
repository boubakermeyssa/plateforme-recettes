# PRD : plateforme recettes healthy → vidéos IA

> BMAD · Agent PM · v0.1 · 13/11/2026 · Source : `docs/brief.md`

## 1. Objectifs et contexte
Voir le brief. L'objectif de la V1 : une utilisatrice s'inscrit, renseigne son profil et reçoit un flux de recettes healthy compatibles, chacune avec une vidéo générée par Veo.

## 2. Exigences fonctionnelles (FR)
**Comptes**
- FR1 : inscription et connexion par e-mail (Supabase Auth).
- FR2 : suppression du compte et de toutes les données associées.

**Onboarding et profil**
- FR3 : onboarding en 6 écrans (voir `front-end-spec.md`), avec progression sauvegardée.
- FR4 : choix du type de profil, `autonome` ou `suivi`.
- FR5 : poids et taille facultatifs, enregistrés seulement si le consentement santé est coché.
- FR6 : grossesse ou maladie chronique déclarée → message conseillant un professionnel, sans blocage.
- FR7 : sélection des allergènes (les 14 officiels) et des régimes.
- FR8 : préférences (aliments aimés ou détestés) et mode de vie (temps, équipement, repas, budget, portions).
- FR9 : page « Mon profil » pour tout modifier, y compris retirer le consentement (ce qui efface poids et taille).

**Fiche nutritionniste**
- FR10 : import d'un PDF ou d'une image (10 Mo max) dans un bucket privé.
- FR11 : extraction des règles par IA : aliment, statut (autorisé, à limiter, interdit), portion, fréquence.
- FR12 : l'utilisatrice relit, corrige et valide les règles ; elles ne s'appliquent qu'après validation.
- FR13 : les règles de la fiche passent avant les préférences et les réglages par défaut.

**Veille et vidéos (n8n)**
- FR14 : chaque jour, n8n récupère, extrait, dédoublonne et note les recettes, puis les écrit dans la table `recettes`.
- FR15 : pour chaque recette notée ≥ 5, n8n génère une vidéo Veo, la stocke dans le bucket `videos` et enregistre son URL.
- FR16 : un plafond quotidien de vidéos est configurable.
- FR17 : alerte e-mail en cas de succès (récapitulatif) et d'erreur.

**Flux de recettes**
- FR18 : chaque recette est classée pour le profil : exclue, à adapter ou compatible.
- FR19 : le flux affiche les recettes compatibles et à adapter, triées par score de préférence.
- FR20 : une recette « à adapter » propose un remplacement généré par IA pour l'ingrédient concerné.
- FR21 : la fiche recette montre la vidéo, les ingrédients, le temps et un lien vers la source.

## 3. Exigences non fonctionnelles (NFR)
- NFR1 : mobile d'abord, utilisable de 360 à 1440 px.
- NFR2 : accessibilité, contraste ≥ 4,5:1, cibles ≥ 44 px, navigation au clavier.
- NFR3 : RLS sur toutes les tables utilisateur ; clé `service_role` uniquement dans n8n.
- NFR4 : RGPD, consentement horodaté, droit à l'effacement, données hébergées en UE.
- NFR5 : performance, flux affiché en moins de 2 s, vidéos en streaming.
- NFR6 : aucun secret dans Git (`.env.local`).
- NFR7 : pas d'objectif calorique ni de régime extrême affiché ; mention « ne remplace pas un avis médical ».
- NFR8 : sources citées, pas de republication du texte ni des photos d'origine.

## 4. Objectifs UI
Voir `front-end-spec.md`. Ambiance bien-être, claire et moderne, vert sauge et pêche.

## 5. Hypothèses techniques
- Monorepo Next.js (App Router, TypeScript, Tailwind) déployé sur Vercel.
- Supabase (Postgres, Auth, Storage), région UE.
- n8n reste l'orchestrateur de la veille et de la vidéo, et écrit via l'API REST de Supabase.
- Veo via l'API Gemini, en asynchrone (on lance la génération, puis on vérifie son statut).
- Claude, utilisé dans n8n et côté serveur de l'app, pour la notation, le prompt vidéo, l'extraction de fiche et les remplacements.
- Tests : Vitest (logique) + Playwright (parcours onboarding).

## 6. Epics
| # | Epic | Objectif |
|---|---|---|
| **E1** | Fondations, profil et onboarding | Projet initialisé, auth, 6 écrans, profil en base, déployé |
| **E2** | Fiche nutritionniste | Import, extraction IA, validation des règles |
| **E3** | Veille → Supabase | Le workflow n8n écrit dans la table `recettes` |
| **E4** | Génération vidéo Veo | Une vidéo par recette retenue, stockée et liée |
| **E5** | Correspondance et flux | Classement par profil, flux personnalisé, fiche recette |

### E1 : Fondations, profil et onboarding
- 1.1 Initialiser le projet (Next.js, Tailwind, charte, Git, GitHub)
- 1.2 Créer Supabase, appliquer le schéma, auth par e-mail
- 1.3 Écrans 1-2 : santé, type de profil et objectif
- 1.4 Écran 3 : poids, taille et consentement
- 1.5 Écrans 4-5 : contraintes, goûts et mode de vie
- 1.6 Page « Mon profil » et suppression du compte
- 1.7 Déploiement Vercel

### E2 : Fiche nutritionniste
- 2.1 Écran 6 : upload vers le bucket privé
- 2.2 Extraction des règles par Claude (route serveur)
- 2.3 Écran de validation et d'édition des règles

### E3 : Veille → Supabase
- 3.1 Table `recettes` et ses index
- 3.2 Adapter le workflow n8n : écriture et dédoublonnage dans Supabase
- 3.3 Alertes Gmail vers l'adresse de Meyssa

### E4 : Génération vidéo Veo
- 4.1 Bucket `videos` et colonnes vidéo
- 4.2 Branche n8n : lancer Veo → vérifier le statut → télécharger → stocker
- 4.3 Plafond quotidien et gestion des échecs

### E5 : Correspondance et flux
- 5.1 Fonction de classement recette ↔ profil
- 5.2 Flux personnalisé
- 5.3 Fiche recette (vidéo, ingrédients, source)
- 5.4 Remplacement IA pour les recettes « à adapter »

## 7. Prochaine étape
Agent UX : `front-end-spec.md`. Agent Architecte : `architecture.md`.
