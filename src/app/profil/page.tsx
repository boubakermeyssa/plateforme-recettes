import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { chargerContraintes, chargerEtape5 } from "@/lib/profil";
import { ALLERGENES, BUDGETS, EQUIPEMENTS, REGIMES, REPAS } from "@/lib/onboarding";
import { deconnexion, retirerConsentement, supprimerCompte } from "./actions";

const libelle = (liste: readonly (readonly [string, string])[], cles: string[]) =>
  cles.map((k) => liste.find(([c]) => c === k)?.[1] ?? k).join(", ") || "Aucun";

const OBJECTIFS: Record<string, string> = { perdre_poids: "Perdre du poids", reequilibrer: "Me rééquilibrer", maintenir: "Maintenir" };

function Section({ titre, etape, children }: { titre: string; etape: number; children: React.ReactNode }) {
  return (
    <section className="rounded-bloc bg-white p-5 shadow-carte">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">{titre}</h2>
        <Link href={`/onboarding/${etape}?retour=profil`} className="text-sm font-semibold text-sauge underline-offset-2 hover:underline">
          Modifier
        </Link>
      </div>
      <dl className="flex flex-col gap-2 text-[15px]">{children}</dl>
    </section>
  );
}

function Ligne({ terme, valeur }: { terme: string; valeur: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-texte-2">{terme}</dt>
      <dd className="text-right font-medium">{valeur}</dd>
    </div>
  );
}

export default async function Profil({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profils").select("*").eq("id", user!.id).single();
  const c = await chargerContraintes(supabase, user!.id);
  const v = await chargerEtape5(supabase, user!.id, p);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-4 px-6 pb-12 pt-8">
      <div className="flex items-center justify-between">
        <Link href="/recettes" className="text-sm font-semibold text-sauge">← Recettes</Link>
        <form action={deconnexion}>
          <button className="text-sm font-semibold text-texte-2 hover:text-texte">Se déconnecter</button>
        </form>
      </div>
      <h1 className="text-[32px] font-extrabold tracking-tight">Mon profil</h1>

      <Section titre="Toi" etape={1}>
        <Ligne terme="Prénom" valeur={p?.prenom || "—"} />
        <Ligne terme="Tranche d'âge" valeur={p?.tranche_age ?? "—"} />
      </Section>

      <Section titre="Mode et objectif" etape={2}>
        <Ligne terme="Mode" valeur={p?.type_profil === "suivi" ? "Avec fiche nutritionniste" : "En autonomie"} />
        <Ligne terme="Objectif" valeur={OBJECTIFS[p?.objectif] ?? "—"} />
      </Section>

      <Section titre="Poids et taille" etape={3}>
        {p?.consentement_sante ? (
          <>
            <Ligne terme="Poids" valeur={`${p.poids_kg} kg`} />
            <Ligne terme="Taille" valeur={`${p.taille_cm} cm`} />
            <form action={retirerConsentement} className="mt-2">
              <button className="text-sm font-semibold text-interdit underline-offset-2 hover:underline">
                Retirer mon consentement et effacer ces données
              </button>
            </form>
          </>
        ) : (
          <p className="text-[15px] text-texte-2">Non renseignés.</p>
        )}
      </Section>

      <Section titre="Allergies et régime" etape={4}>
        <Ligne terme="Allergies" valeur={libelle(ALLERGENES, c.allergenes)} />
        <Ligne terme="Régime" valeur={libelle(REGIMES, c.regimes)} />
      </Section>

      <Section titre="Goûts et quotidien" etape={5}>
        <Ligne terme="J'adore" valeur={v.aimes.join(", ") || "—"} />
        <Ligne terme="Je déteste" valeur={v.detestes.join(", ") || "—"} />
        <Ligne terme="Temps max" valeur={v.temps_max_min >= 60 ? "1 h+" : `${v.temps_max_min} min`} />
        <Ligne terme="Équipement" valeur={libelle(EQUIPEMENTS, v.equipements)} />
        <Ligne terme="Repas" valeur={libelle(REPAS, v.repas_vises)} />
        <Ligne terme="Budget" valeur={libelle(BUDGETS, [v.budget])} />
        <Ligne terme="Portions" valeur={`${v.portions} pers.`} />
      </Section>

      <section className="mt-4 rounded-bloc border-2 border-interdit/20 p-5">
        <h2 className="mb-1 text-lg font-extrabold text-interdit">Supprimer mon compte</h2>
        <p className="mb-3 text-sm leading-relaxed text-texte-2">
          Toutes tes données (profil, préférences, fiche) seront effacées définitivement. Tape SUPPRIMER pour confirmer.
        </p>
        {erreur && (
          <p role="alert" className="mb-2 text-sm text-interdit">
            {erreur === "confirmation" ? "Tape SUPPRIMER en majuscules pour confirmer." : "La suppression a échoué, réessaie."}
          </p>
        )}
        <form action={supprimerCompte} className="flex gap-2">
          <label className="sr-only" htmlFor="confirmation">Confirmation</label>
          <input id="confirmation" name="confirmation" placeholder="SUPPRIMER" className="h-11 min-w-0 flex-1 rounded-carte bg-white px-3 shadow-carte" />
          <button className="h-11 rounded-carte bg-interdit px-4 text-sm font-bold text-white">Supprimer</button>
        </form>
      </section>
    </main>
  );
}
