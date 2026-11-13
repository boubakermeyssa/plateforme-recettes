"use client";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

export function ChoiceChip({ selected = false, className = "", ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`min-h-11 rounded-full px-4 py-2.5 text-sm transition-colors ${
        selected ? "bg-sauge font-semibold text-white" : "bg-white text-texte shadow-carte hover:bg-sauge-clair"
      } ${className}`}
      {...props}
    />
  );
}
