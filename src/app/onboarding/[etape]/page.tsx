import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressHeader } from "@/components/onboarding/ProgressHeader";
import { Etape1Form } from "@/components/onboarding/Etape1Form";
import { Etape2Form } from "@/components/onboarding/Etape2Form";
import { Etape3Form } from "@/components/onboarding/Etape3Form";
import { Etape4Form } from "@/components/onboarding/Etape4Form";
import { Etape5Form } from "@/components/onboarding/Etape5Form";
import { chargerContraintes, chargerEtape5 } from "@/lib/profil";

const TEXTES: Record<number, { titre: string; sousTitre: string }> = {
  1: { titre: "Faisons connaissance", sousTitre: "Quelques questions pour te proposer des recettes vraiment adaptées." },
  2: { titre: "Comment tu veux avancer ?", sousTitre: "Tu pourras changer de mode à tout moment." },
  3: { titre: "Ton point de départ", sousTitre: "Optionnel. Ça nous aide à ajuster les portions, rien de plus." },
  4: { titre: "Ce que tu ne manges pas", sousTitre: "Les recettes avec ces aliments seront exclues." },
  5: { titre: "Tes goûts, ton quotidien", sousTitre: "Pour des recettes que tu as vraiment envie de cuisiner." },
};

export default async function EtapeOnboarding({ params }: { params: Promise<{ etape: string }> }) {
  const etape = Number((await params).etape);
  if (!TEXTES[etape]) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profils").select("*").eq("id", user!.id).single();

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-6 pb-8 pt-6">
      <ProgressHeader etape={etape} {...TEXTES[etape]} />
      {etape === 1 && (
        <Etape1Form
          initial={{
            prenom: p?.prenom || "",
            tranche_age: p?.tranche_age ?? undefined,
            alerte_grossesse: p?.alerte_grossesse ?? false,
            alerte_maladie: (p?.alerte_maladie?.length ?? 0) > 0,
          }}
        />
      )}
      {etape === 2 && <Etape2Form initial={{ type_profil: p?.type_profil, objectif: p?.objectif }} />}
      {etape === 3 && (
        <Etape3Form
          initial={{
            consentement: p?.consentement_sante ?? false,
            poids: p?.poids_kg != null ? String(p.poids_kg) : "",
            taille: p?.taille_cm != null ? String(p.taille_cm) : "",
          }}
        />
      )}
      {etape === 4 && <Etape4Form initial={await chargerContraintes(supabase, user!.id)} />}
      {etape === 5 && <Etape5Form initial={await chargerEtape5(supabase, user!.id, p)} />}
    </main>
  );
}
