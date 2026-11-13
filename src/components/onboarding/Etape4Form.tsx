"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { MultiChips } from "./MultiChips";
import { FormFooter } from "./FormFooter";
import { enregistrerEtape4 } from "@/app/onboarding/actions";
import { ALLERGENES, REGIMES, type Etape4 } from "@/lib/onboarding";

export function Etape4Form({ initial }: { initial: Etape4 }) {
  const router = useRouter();
  const depuisProfil = useSearchParams().get("retour") === "profil";
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState("");
  const [v, setV] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setErreur("");
        demarrer(async () => {
          const r = await enregistrerEtape4(v);
          if (r.ok) router.push(depuisProfil ? "/profil" : "/onboarding/5");
          else setErreur(r.erreur);
        });
      }}
      className="flex flex-1 flex-col justify-between gap-6"
    >
      <div className="flex flex-col gap-5">
        <MultiChips id="lbl-allergenes" titre="Allergies et intolérances" options={ALLERGENES} valeurs={v.allergenes} onChange={(allergenes) => setV({ ...v, allergenes })} />
        <MultiChips id="lbl-regimes" titre="Régime" options={REGIMES} valeurs={v.regimes} onChange={(regimes) => setV({ ...v, regimes })} />
      </div>
      <FormFooter erreur={erreur} enCours={enCours} />
    </form>
  );
}
