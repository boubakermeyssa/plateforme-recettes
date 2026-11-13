"use client";

import { ChoiceChip } from "@/components/ui";
import { Label } from "./Label";

type Props<K extends string> = {
  id: string;
  titre: string;
  options: readonly (readonly [K, string])[];
  valeurs: K[];
  onChange: (v: K[]) => void;
  unique?: boolean;
};

export function MultiChips<K extends string>({ id, titre, options, valeurs, onChange, unique }: Props<K>) {
  const basculer = (k: K) =>
    onChange(unique ? [k] : valeurs.includes(k) ? valeurs.filter((x) => x !== k) : [...valeurs, k]);
  return (
    <div className="flex flex-col gap-2" role="group" aria-labelledby={id}>
      <Label id={id}>{titre}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map(([k, texte]) => (
          <ChoiceChip key={k} selected={valeurs.includes(k)} onClick={() => basculer(k)}>
            {texte}
          </ChoiceChip>
        ))}
      </div>
    </div>
  );
}
