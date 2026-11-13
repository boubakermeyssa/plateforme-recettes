import type { SupabaseClient } from "@supabase/supabase-js";
import type { Etape4, Etape5 } from "@/lib/onboarding";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function chargerContraintes(supabase: SupabaseClient, id: string): Promise<Etape4> {
  const [{ data: a }, { data: r }] = await Promise.all([
    supabase.from("profil_allergies").select("allergene").eq("profil_id", id),
    supabase.from("profil_regimes").select("regime").eq("profil_id", id),
  ]);
  return {
    allergenes: (a ?? []).map((x: any) => x.allergene),
    regimes: (r ?? []).map((x: any) => x.regime),
  };
}

export async function chargerEtape5(supabase: SupabaseClient, id: string, p: any): Promise<Etape5> {
  const { data: prefs } = await supabase.from("profil_preferences").select("type, valeur").eq("profil_id", id);
  const de = (t: string) => (prefs ?? []).filter((x: any) => x.type === t).map((x: any) => x.valeur);
  return {
    aimes: de("aliment_aime"),
    detestes: de("aliment_deteste"),
    temps_max_min: p?.temps_max_min ?? 30,
    equipements: p?.equipements ?? [],
    repas_vises: p?.repas_vises?.length ? p.repas_vises : ["dejeuner", "diner"],
    budget: p?.budget ?? "moyen",
    portions: p?.portions ?? 1,
  };
}
