"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ChoiceChip } from "@/components/ui";
import { MultiChips } from "./MultiChips";
import { TagInput } from "./TagInput";
import { FormFooter } from "./FormFooter";
import { Label } from "./Label";
import { enregistrerEtape5 } from "@/app/onboarding/actions";
import { BUDGETS, EQUIPEMENTS, REPAS, TEMPS, type Etape5 } from "@/lib/onboarding";

export function Etape5Form({ initial, texteBouton }: { initial: Etape5; texteBouton?: string }) {
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
          const r = await enregistrerEtape5(v);
          if (!r.ok) return setErreur(r.erreur);
          router.push(depuisProfil ? "/profil" : r.suivi ? "/onboarding/6" : "/recettes");
        });
      }}
      className="flex flex-1 flex-col justify-between gap-6"
    >
      <div className="flex flex-col gap-5">
        <TagInput id="aimes" titre="Aliments que tu adores" placeholder="ex : patate douce" valeurs={v.aimes} onChange={(aimes) => setV({ ...v, aimes })} />
        <TagInput id="detestes" titre="Aliments que tu détestes" placeholder="ex : brocoli" valeurs={v.detestes} onChange={(detestes) => setV({ ...v, detestes })} />

        <div className="flex flex-col gap-2" role="group" aria-labelledby="lbl-temps">
          <Label id="lbl-temps">Temps de cuisine max</Label>
          <div className="flex flex-wrap gap-2">
            {TEMPS.map((t) => (
              <ChoiceChip key={t} selected={v.temps_max_min === t} onClick={() => setV({ ...v, temps_max_min: t })}>
                {t === 60 ? "1 h+" : `${t} min`}
              </ChoiceChip>
            ))}
          </div>
        </div>

        <MultiChips id="lbl-equip" titre="Équipement" options={EQUIPEMENTS} valeurs={v.equipements} onChange={(equipements) => setV({ ...v, equipements })} />
        <MultiChips id="lbl-repas" titre="Repas" options={REPAS} valeurs={v.repas_vises} onChange={(repas_vises) => setV({ ...v, repas_vises })} />
        <MultiChips id="lbl-budget" titre="Budget" options={BUDGETS} valeurs={[v.budget]} unique onChange={([budget]) => setV({ ...v, budget })} />

        <div className="flex flex-col gap-2">
          <Label id="lbl-portions">Portions</Label>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Moins de portions" onClick={() => setV({ ...v, portions: Math.max(1, v.portions - 1) })} className="size-11 rounded-full bg-white text-xl shadow-carte">−</button>
            <span aria-live="polite" className="min-w-16 text-center text-base font-semibold">
              {v.portions} pers.
            </span>
            <button type="button" aria-label="Plus de portions" onClick={() => setV({ ...v, portions: Math.min(8, v.portions + 1) })} className="size-11 rounded-full bg-white text-xl shadow-carte">+</button>
          </div>
        </div>
      </div>
      <FormFooter erreur={erreur} enCours={enCours} texte={texteBouton} />
    </form>
  );
}
