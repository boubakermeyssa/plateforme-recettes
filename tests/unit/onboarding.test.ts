import { describe, expect, it } from "vitest";
import { etape3Schema } from "@/lib/onboarding";

describe("étape 3 : poids, taille et consentement", () => {
  it("accepte poids et taille avec consentement", () => {
    expect(etape3Schema.safeParse({ consentement_sante: true, poids_kg: 68, taille_cm: 165 }).success).toBe(true);
  });
  it("refuse un poids hors bornes", () => {
    expect(etape3Schema.safeParse({ consentement_sante: true, poids_kg: 20, taille_cm: 165 }).success).toBe(false);
  });
  it("refuse une taille hors bornes", () => {
    expect(etape3Schema.safeParse({ consentement_sante: true, poids_kg: 68, taille_cm: 250 }).success).toBe(false);
  });
  it("sans consentement, aucune donnée n'est gardée", () => {
    const r = etape3Schema.safeParse({ consentement_sante: false, poids_kg: 68, taille_cm: 165 });
    expect(r.success).toBe(true);
    expect(r.success && "poids_kg" in r.data).toBe(false);
  });
});

import { etape4Schema, etape5Schema } from "@/lib/onboarding";

describe("étapes 4-5 : contraintes et mode de vie", () => {
  it("refuse un allergène inconnu", () => {
    expect(etape4Schema.safeParse({ allergenes: ["chocolat"], regimes: [] }).success).toBe(false);
  });
  it("exige au moins un repas", () => {
    const base = { aimes: [], detestes: [], temps_max_min: 30, equipements: [], budget: "moyen", portions: 1 };
    expect(etape5Schema.safeParse({ ...base, repas_vises: [] }).success).toBe(false);
    expect(etape5Schema.safeParse({ ...base, repas_vises: ["diner"] }).success).toBe(true);
  });
});
