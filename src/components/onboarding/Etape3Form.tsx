"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { PrimaryButton, TextField } from "@/components/ui";
import { enregistrerEtape3 } from "@/app/onboarding/actions";

type Init = { consentement: boolean; poids: string; taille: string };

export function Etape3Form({ initial }: { initial: Init }) {
  const router = useRouter();
  const depuisProfil = useSearchParams().get("retour") === "profil";
  const [enCours, demarrer] = useTransition();
  const [erreur, setErreur] = useState("");
  const [consentement, setConsentement] = useState(initial.consentement);
  const [poids, setPoids] = useState(initial.poids);
  const [taille, setTaille] = useState(initial.taille);

  function envoyer(avecDonnees: boolean) {
    setErreur("");
    demarrer(async () => {
      const r = await enregistrerEtape3(
        avecDonnees && consentement
          ? { consentement_sante: true, poids_kg: Number(poids.replace(",", ".")), taille_cm: Number(taille) }
          : { consentement_sante: false },
      );
      if (r.ok) router.push(depuisProfil ? "/profil" : "/onboarding/4");
      else setErreur(r.erreur);
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        envoyer(true);
      }}
      className="flex flex-1 flex-col justify-between gap-6"
    >
      <div className="flex flex-col gap-4">
        <label className="flex items-start gap-3 rounded-carte bg-white px-4 py-3.5 shadow-carte">
          <input
            type="checkbox"
            className="mt-0.5 size-5 flex-none accent-sauge"
            checked={consentement}
            onChange={(e) => setConsentement(e.target.checked)}
          />
          <span className="text-sm leading-relaxed">
            J&apos;accepte que mon poids et ma taille soient enregistrés pour personnaliser mes recettes. Je peux les
            supprimer à tout moment.
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Poids (kg)"
            name="poids"
            inputMode="decimal"
            placeholder="ex : 68"
            disabled={!consentement}
            required={consentement}
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
          />
          <TextField
            label="Taille (cm)"
            name="taille"
            inputMode="numeric"
            placeholder="ex : 165"
            disabled={!consentement}
            required={consentement}
            value={taille}
            onChange={(e) => setTaille(e.target.value)}
          />
        </div>

        <p className="text-[13px] leading-relaxed text-texte-2">
          Données de santé protégées, jamais partagées. Sans ton accord, ces champs ne sont pas enregistrés.
        </p>

        <button
          type="button"
          onClick={() => envoyer(false)}
          disabled={enCours}
          className="w-fit text-sm font-semibold text-sauge underline-offset-2 hover:underline"
        >
          Passer cette étape
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {erreur && (
          <p role="alert" className="text-sm text-interdit">
            {erreur}
          </p>
        )}
        <PrimaryButton type="submit" disabled={enCours || !consentement}>
          {enCours ? "Enregistrement…" : "Continuer"}
        </PrimaryButton>
      </div>
    </form>
  );
}
