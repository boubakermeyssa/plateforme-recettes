"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ChoiceChip, PrimaryButton, TextField } from "@/components/ui";
import { HealthNotice } from "./HealthNotice";
import { Label } from "./Label";
import { enregistrerEtape1 } from "@/app/onboarding/actions";
import { TRANCHES_AGE, type Etape1 } from "@/lib/onboarding";

export function Etape1Form({ initial }: { initial: Partial<Etape1> }) {
  const router = useRouter();
  const depuisProfil = useSearchParams().get("retour") === "profil";
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState("");
  const [v, setV] = useState<Partial<Etape1>>({ alerte_grossesse: false, alerte_maladie: false, ...initial });

  function continuer(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    demarrer(async () => {
      const r = await enregistrerEtape1(v as Etape1);
      if (r.ok) router.push(depuisProfil ? "/profil" : "/onboarding/2");
      else setErreur(r.erreur);
    });
  }

  return (
    <form onSubmit={continuer} className="flex flex-1 flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <TextField
          label="Prénom"
          name="prenom"
          autoComplete="given-name"
          required
          value={v.prenom ?? ""}
          onChange={(e) => setV({ ...v, prenom: e.target.value })}
        />

        <div className="flex flex-col gap-2" role="group" aria-labelledby="lbl-age">
          <Label id="lbl-age">Tranche d&apos;âge</Label>
          <div className="flex flex-wrap gap-2">
            {TRANCHES_AGE.map((t) => (
              <ChoiceChip key={t} selected={v.tranche_age === t} onClick={() => setV({ ...v, tranche_age: t })}>
                {t}
              </ChoiceChip>
            ))}
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <Label>Ta situation</Label>
          {(
            [
              ["alerte_grossesse", "Enceinte ou allaitante"],
              ["alerte_maladie", "Maladie chronique (diabète, rein, cœur…)"],
            ] as const
          ).map(([cle, texte]) => (
            <label key={cle} className="flex min-h-[52px] items-center gap-3 rounded-carte bg-white px-4 py-3 text-[15px] shadow-carte">
              <input
                type="checkbox"
                className="size-5 accent-sauge"
                checked={!!v[cle]}
                onChange={(e) => setV({ ...v, [cle]: e.target.checked })}
              />
              {texte}
            </label>
          ))}
          {(v.alerte_grossesse || v.alerte_maladie) && <HealthNotice />}
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
