"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ChoiceChip, OptionCard, PrimaryButton } from "@/components/ui";
import { Label } from "./Label";
import { enregistrerEtape2 } from "@/app/onboarding/actions";
import type { Etape2 } from "@/lib/onboarding";

const OBJECTIFS = [
  ["perdre_poids", "Perdre du poids"],
  ["reequilibrer", "Me rééquilibrer"],
  ["maintenir", "Maintenir"],
] as const;

export function Etape2Form({ initial }: { initial: Partial<Etape2> }) {
  const router = useRouter();
  const depuisProfil = useSearchParams().get("retour") === "profil";
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState("");
  const [v, setV] = useState<Partial<Etape2>>(initial);

  function continuer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    demarrer(async () => {
      const r = await enregistrerEtape2(v as Etape2);
      if (r.ok) router.push(depuisProfil ? "/profil" : "/onboarding/3");
      else setErreur(r.erreur);
    });
  }

  return (
    <form onSubmit={continuer} className="flex flex-1 flex-col justify-between gap-6">
      <div className="flex flex-col gap-3.5">
        <OptionCard
          title="En autonomie"
          description="Je veux perdre du poids à mon rythme. La plateforme me propose des recettes équilibrées selon mes réponses."
          selected={v.type_profil === "autonome"}
          onSelect={() => setV({ ...v, type_profil: "autonome" })}
        />
        <OptionCard
          title="Avec ma fiche nutritionniste"
          description="J'ai un programme d'un pro. J'importe ma fiche et les recettes suivent ses règles en priorité."
          selected={v.type_profil === "suivi"}
          onSelect={() => setV({ ...v, type_profil: "suivi" })}
        />

        <div className="mt-3 flex flex-col gap-2" role="group" aria-labelledby="lbl-objectif">
          <Label id="lbl-objectif">Ton objectif</Label>
          <div className="flex flex-wrap gap-2">
            {OBJECTIFS.map(([val, texte]) => (
              <ChoiceChip key={val} selected={v.objectif === val} onClick={() => setV({ ...v, objectif: val })}>
                {texte}
              </ChoiceChip>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {erreur && (
          <p role="alert" className="text-sm text-interdit">
            {erreur}
          </p>
        )}
        <PrimaryButton type="submit" disabled={enCours}>
          {enCours ? "Enregistrement…" : "Continuer"}
        </PrimaryButton>
      </div>
    </form>
  );
}
