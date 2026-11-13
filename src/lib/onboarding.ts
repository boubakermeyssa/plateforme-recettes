import { z } from "zod";

export const TOTAL_ETAPES = 6;

export const TRANCHES_AGE = ["18-25", "26-35", "36-45", "46-55", "56+"] as const;

export const etape1Schema = z.object({
  prenom: z.string().trim().min(1, "Ton prénom est obligatoire").max(50),
  tranche_age: z.enum(TRANCHES_AGE, { message: "Choisis ta tranche d'âge" }),
  alerte_grossesse: z.boolean(),
  alerte_maladie: z.boolean(),
});

export const etape2Schema = z.object({
  type_profil: z.enum(["autonome", "suivi"], { message: "Choisis un mode" }),
  objectif: z.enum(["perdre_poids", "reequilibrer", "maintenir"], { message: "Choisis un objectif" }),
});

export type Etape1 = z.infer<typeof etape1Schema>;
export type Etape2 = z.infer<typeof etape2Schema>;
export type Resultat = { ok: true } | { ok: false; erreur: string };

export const etape3Schema = z.discriminatedUnion("consentement_sante", [
  z.object({
    consentement_sante: z.literal(true),
    poids_kg: z.number({ message: "Indique ton poids" }).min(30, "Poids entre 30 et 300 kg").max(300, "Poids entre 30 et 300 kg"),
    taille_cm: z.number({ message: "Indique ta taille" }).int().min(120, "Taille entre 120 et 230 cm").max(230, "Taille entre 120 et 230 cm"),
  }),
  z.object({ consentement_sante: z.literal(false) }),
]);

export type Etape3 = z.infer<typeof etape3Schema>;

export const ALLERGENES = [
  ["gluten", "Gluten"], ["lait", "Lait"], ["oeufs", "Œufs"], ["fruits_a_coque", "Fruits à coque"],
  ["arachides", "Arachides"], ["poissons", "Poissons"], ["crustaces", "Crustacés"], ["soja", "Soja"],
  ["sesame", "Sésame"], ["moutarde", "Moutarde"], ["celeri", "Céleri"], ["sulfites", "Sulfites"],
  ["lupin", "Lupin"], ["mollusques", "Mollusques"],
] as const;

export const REGIMES = [
  ["vegetarien", "Végétarien"], ["vegan", "Vegan"], ["pescetarien", "Pescétarien"], ["halal", "Halal"],
  ["sans_porc", "Sans porc"], ["sans_gluten", "Sans gluten"], ["sans_lactose", "Sans lactose"],
] as const;

export const TEMPS = [15, 30, 45, 60] as const;
export const EQUIPEMENTS = [["four", "Four"], ["air_fryer", "Air fryer"], ["micro_ondes", "Micro-ondes"], ["blender", "Blender"]] as const;
export const REPAS = [["petit_dej", "Petit-déj"], ["dejeuner", "Déjeuner"], ["diner", "Dîner"], ["collation", "Collation"]] as const;
export const BUDGETS = [["petit", "Petit"], ["moyen", "Moyen"], ["large", "Large"]] as const;

const cles = <T extends readonly (readonly [string, string])[]>(l: T) => l.map(([k]) => k) as [T[number][0], ...T[number][0][]];

export const etape4Schema = z.object({
  allergenes: z.array(z.enum(cles(ALLERGENES))),
  regimes: z.array(z.enum(cles(REGIMES))),
});

export const etape5Schema = z.object({
  aimes: z.array(z.string().trim().min(1).max(40)).max(30),
  detestes: z.array(z.string().trim().min(1).max(40)).max(30),
  temps_max_min: z.number().int().min(5).max(180),
  equipements: z.array(z.enum(cles(EQUIPEMENTS))),
  repas_vises: z.array(z.enum(cles(REPAS))).min(1, "Choisis au moins un repas"),
  budget: z.enum(cles(BUDGETS)),
  portions: z.number().int().min(1).max(8),
});

export type Etape4 = z.infer<typeof etape4Schema>;
export type Etape5 = z.infer<typeof etape5Schema>;
