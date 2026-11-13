# Front-end Spec

> BMAD · Agent UX · v0.1 · 13/11/2026 · Maquettes : https://claude.ai/artifact/GbbY8KAQAoEizy3a35DJpt

## 1. Principes
- Mobile d'abord (390 px de référence) ; sur desktop, contenu centré sur 480 px max pour l'onboarding.
- Une question claire par écran, progression visible, retour possible à tout moment.
- Ton bienveillant, sans culpabilisation. Jamais de chiffre de calories ni de « kilos à perdre ».

## 2. Charte
| Rôle | Valeur |
|---|---|
| Police | Plus Jakarta Sans (400 / 600 / 700 / 800) |
| Fond | `#F8F4EF` |
| Texte | `#24302A` · secondaire `#5F6B64` |
| Principale (sauge) | `#4F7A5A` · survol `#3B5F45` · fond sélection `#EAF2EB` |
| Accent pêche | `#E8A38C` (progression, zone d'import) |
| Alerte | fond `#FDF0E8`, texte `#7A3E1F`, icône `#C2643A` |
| Statuts | autorisé `#4F7A5A` · à limiter `#A65F00` · interdit `#B42318` |
| Cartes | blanc, sans bordure, rayon 20 px, ombre `0 6px 20px rgba(79,122,90,0.08)` |
| Boutons | pilule, hauteur 58 px, ombre colorée |
| Pastilles | blanches ; sélectionnées : fond sauge, texte blanc |

## 3. Parcours
```
Accueil → Inscription / Connexion → Onboarding (1→5, +6 si profil "suivi") → Flux de recettes
                                                  ↘ Mon profil (modifiable à tout moment)
```

## 4. Écrans d'onboarding
| # | Écran | Champs | Règles |
|---|---|---|---|
| 1 | Toi et ta santé | prénom*, tranche d'âge*, grossesse, maladie chronique | Si une case santé est cochée : afficher le message d'alerte, ne rien bloquer |
| 2 | Type de profil | autonome / suivi*, objectif* | « Suivi » ajoute l'écran 6 |
| 3 | Poids et taille | poids (30-300), taille (120-230), consentement | Champs désactivés tant que le consentement n'est pas coché ; lien « Passer cette étape » |
| 4 | Allergies et régime | 14 allergènes, régimes | Choix multiples, aucun obligatoire |
| 5 | Goûts et mode de vie | aimés, détestés, temps max, équipement, repas, budget, portions | Valeurs par défaut : 30 min, déjeuner + dîner, 1 portion |
| 6 | Fiche nutritionniste | upload PDF/JPG/PNG ≤ 10 Mo, puis liste des règles | Bouton « Valider ma fiche » actif après relecture ; règles modifiables |

\* obligatoire

## 5. États à prévoir
- **Chargement** : squelettes de cartes, jamais d'écran vide.
- **Erreur réseau** : message + bouton « Réessayer », saisie conservée.
- **Extraction de la fiche en cours** : « Lecture de ta fiche… » (jusqu'à 30 s).
- **Extraction échouée ou illisible** : proposer de saisir les règles à la main.
- **Flux vide** : « Pas encore de recette pour ton profil, reviens demain » + lien pour élargir les préférences.
- **Vidéo pas encore prête** : visuel de remplacement + « Vidéo en préparation ».

## 6. Composants
`ProgressHeader` (retour + barre + étape), `ChoiceChip`, `OptionCard`, `TextField`, `ConsentCheckbox`, `HealthNotice`, `UploadZone`, `RuleRow` (aliment + statut + portion), `PrimaryButton`, `RecipeCard` (vidéo, titre, temps, badge « à adapter »), `RecipeDetail`.

## 7. Accessibilité
Vrais `<button>`, `<label>`, `<input>` ; `aria-label` sur les boutons icône ; focus visible ; statuts aussi indiqués par le texte, pas seulement par la couleur ; vidéos sans son automatique, avec sous-titres si Veo en ajoute.
