# Project Brief : plateforme recettes healthy → vidéos IA

> BMAD · Agent Analyste · v0.1 · 13/11/2026 · Auteure : Meyssa

## 1. Résumé
Une app web qui propose chaque jour des recettes healthy, accompagnées d'une vidéo courte générée par IA, filtrées selon le profil de chaque utilisatrice : son régime, ses allergies, ses goûts, et sa fiche nutritionniste si elle en a une.

## 2. Problème
- Les personnes qui veulent perdre du poids reçoivent des recettes génériques (TikTok, Instagram, sites de cuisine) qui ne tiennent compte ni de leurs contraintes ni de leur programme.
- Une personne suivie par un nutritionniste doit traduire seule sa fiche (« féculents 150 g max », « pas de sucre ajouté ») en recettes concrètes.
- Le format vidéo court est celui qui donne envie de cuisiner, mais il n'est jamais personnalisé.

## 3. Solution proposée
1. **Veille automatisée (n8n)** : récupération quotidienne des recettes healthy sur des sites sources, extraction, dédoublonnage, notation par IA.
2. **Génération vidéo (Veo)** : une vidéo courte par recette retenue, à partir d'un prompt généré par IA.
3. **Profil utilisatrice** : questionnaire d'onboarding, et import de la fiche nutritionniste avec extraction des règles par IA.
4. **Correspondance** : chaque recette est classée « exclue », « à adapter » ou « compatible » pour chaque profil.

## 4. Utilisatrices cibles
| Segment | Description | Besoin principal |
|---|---|---|
| **Autonome** | Veut perdre du poids sans suivi professionnel | Des idées saines, simples, motivantes, sans se tromper |
| **Suivie** | A un programme écrit par un nutritionniste | Des recettes qui respectent sa fiche, sans tout recalculer |

## 5. Objectifs
| Objectif | Indicateur V1 |
|---|---|
| Recettes personnalisées | ≥ 10 recettes compatibles par profil et par semaine |
| Onboarding fluide | ≥ 70 % des inscrites terminent les 6 écrans |
| Vidéos disponibles | ≥ 80 % des recettes affichées ont leur vidéo |
| Veille fiable | Workflow quotidien réussi ≥ 95 % des jours |

## 6. Périmètre MVP
**Dans le MVP :** inscription et connexion, onboarding en 6 écrans, profil modifiable, import et validation de la fiche, veille n8n branchée sur Supabase, génération Veo, flux de recettes personnalisé avec vidéo et lien vers la source.

**Hors MVP :** app mobile native, compte nutritionniste, liste de courses, planning de repas, suivi du poids dans le temps, réseau social et partage, paiement.

## 7. Contraintes et hypothèses
- Stack : n8n, Supabase, Next.js, Vercel, Veo (API Gemini).
- Projet d'école (Master Decode) avec une ambition produit.
- Budget Veo limité : on génère une vidéo seulement pour les recettes retenues (note ≥ 5).
- Données de santé (poids, taille, fiche) : RGPD article 9, consentement explicite.
- Droits : on ne republie ni le texte ni les photos des sites sources, on cite et on lie la source.

## 8. Risques
| Risque | Impact | Parade |
|---|---|---|
| Un site source change son HTML | La veille s'arrête | Extraction via JSON-LD + alerte d'erreur Gmail |
| Coût de Veo | Budget dépassé | Plafond quotidien de générations |
| Mauvaise extraction de la fiche | Une recette interdite est proposée | Validation obligatoire par l'utilisatrice |
| Usage santé à risque (profil autonome) | Responsabilité | Message « avis médical », pas d'objectif calorique |
| Scraping et droits | Juridique | Respect des CGU et robots.txt, source citée |

## 9. Prochaine étape
Agent PM : rédiger le PRD (`docs/prd.md`).
