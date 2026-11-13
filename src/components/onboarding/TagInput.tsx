"use client";

import { useState } from "react";
import { Label } from "./Label";

type Props = { id: string; titre: string; placeholder: string; valeurs: string[]; onChange: (v: string[]) => void };

export function TagInput({ id, titre, placeholder, valeurs, onChange }: Props) {
  const [saisie, setSaisie] = useState("");
  const ajouter = () => {
    const v = saisie.trim().toLowerCase();
    if (v && !valeurs.includes(v)) onChange([...valeurs, v]);
    setSaisie("");
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>
        <Label>{titre}</Label>
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={saisie}
          placeholder={placeholder}
          onChange={(e) => setSaisie(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              ajouter();
            }
          }}
          className="h-[52px] min-w-0 flex-1 rounded-carte bg-white px-4 text-base shadow-carte placeholder:text-texte-2/70"
        />
        <button type="button" onClick={ajouter} className="h-[52px] rounded-carte bg-sauge-clair px-4 text-sm font-semibold text-sauge-fonce">
          Ajouter
        </button>
      </div>
      {valeurs.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {valeurs.map((v) => (
            <li key={v}>
              <button
                type="button"
                onClick={() => onChange(valeurs.filter((x) => x !== v))}
                aria-label={`Retirer ${v}`}
                className="flex min-h-9 items-center gap-1.5 rounded-full bg-sauge px-3 text-sm font-semibold text-white"
              >
                {v} <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
