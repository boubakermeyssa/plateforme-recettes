"use server";

import { createClient } from "@/lib/supabase/server";

async function session() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Remplace toutes les lignes d'une table de liaison du profil. */
async function remplacer(table: string, lignes: Record<string, unknown>[], filtre?: [string, string[]]) {
  const { supabase, user } = await session();
  if (!user) return "Session expirée, reconnecte-toi.";
  let del = supabase.from(table).delete().eq("profil_id", user.id);
  if (filtre) del = del.in(filtre[0], filtre[1]);
  const { error: e1 } = await del;
  if (e1) return "Enregistrement impossible, réessaie.";
  if (lignes.length) {
    const { error: e2 } = await supabase.from(table).insert(lignes.map((l) => ({ ...l, profil_id: user.id })));
    if (e2) return "Enregistrement impossible, réessaie.";
  }
  return null;
}
import { etape1Schema, etape2Schema, etape3Schema, etape4Schema, etape5Schema, type Etape1, type Etape2, type Etape3, type Etape4, type Etape5, type Resultat } from "@/lib/onboarding";

async function majProfil(valeurs: Record<string, unknown>): Promise<Resultat> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erreur: "Session expirée, reconnecte-toi." };

  const { error } = await supabase.from("profils").update(valeurs).eq("id", user.id);
  return error ? { ok: false, erreur: "Enregistrement impossible, réessaie." } : { ok: true };
}

export async function enregistrerEtape1(donnees: Etape1): Promise<Resultat> {
  const r = etape1Schema.safeParse(donnees);
  if (!r.success) return { ok: false, erreur: r.error.issues[0].message };
  const { alerte_maladie, ...reste } = r.data;
  return majProfil({ ...reste, alerte_maladie: alerte_maladie ? ["chronique"] : [] });
}

export async function enregistrerEtape2(donnees: Etape2): Promise<Resultat> {
  const r = etape2Schema.safeParse(donnees);
  if (!r.success) return { ok: false, erreur: r.error.issues[0].message };
  return majProfil(r.data);
}

export async function enregistrerEtape3(donnees: Etape3): Promise<Resultat> {
  const r = etape3Schema.safeParse(donnees);
  if (!r.success) return { ok: false, erreur: r.error.issues[0].message };
  if (!r.data.consentement_sante) {
    // Sans consentement : on n'enregistre rien et on efface d'éventuelles anciennes valeurs
    return majProfil({ consentement_sante: false, consentement_date: null, poids_kg: null, taille_cm: null });
  }
  return majProfil({ ...r.data, consentement_date: new Date().toISOString() });
}

export async function enregistrerEtape4(donnees: Etape4): Promise<Resultat> {
  const r = etape4Schema.safeParse(donnees);
  if (!r.success) return { ok: false, erreur: r.error.issues[0].message };
  const e =
    (await remplacer("profil_allergies", r.data.allergenes.map((allergene) => ({ allergene })))) ??
    (await remplacer("profil_regimes", r.data.regimes.map((regime) => ({ regime }))));
  return e ? { ok: false, erreur: e } : { ok: true };
}

export async function enregistrerEtape5(donnees: Etape5): Promise<Resultat & { suivi?: boolean }> {
  const r = etape5Schema.safeParse(donnees);
  if (!r.success) return { ok: false, erreur: r.error.issues[0].message };
  const { aimes, detestes, ...profil } = r.data;
  const prefs = [
    ...aimes.map((valeur) => ({ type: "aliment_aime", valeur })),
    ...detestes.map((valeur) => ({ type: "aliment_deteste", valeur })),
  ];
  const e = await remplacer("profil_preferences", prefs, ["type", ["aliment_aime", "aliment_deteste"]]);
  if (e) return { ok: false, erreur: e };
  const { supabase, user } = await session();
  const { data, error } = await supabase
    .from("profils")
    .update({ ...profil, onboarding_termine: false })
    .eq("id", user!.id)
    .select("type_profil")
    .single();
  if (error) return { ok: false, erreur: "Enregistrement impossible, réessaie." };
  const suivi = data.type_profil === "suivi";
  if (!suivi) {
    const { error: erreurFin } = await supabase.from("profils").update({ onboarding_termine: true }).eq("id", user!.id);
    if (erreurFin) return { ok: false, erreur: "Enregistrement impossible, réessaie." };
  }
  return { ok: true, suivi };
}
