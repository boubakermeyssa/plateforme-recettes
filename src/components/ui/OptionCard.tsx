"use client";

type Props = {
  title: string;
  description: string;
  selected?: boolean;
  onSelect?: () => void;
};

export function OptionCard({ title, description, selected = false, onSelect }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-full flex-col gap-1.5 rounded-bloc p-5 text-left transition-colors ${
        selected ? "border-2 border-sauge bg-sauge-clair" : "border-2 border-transparent bg-white shadow-carte"
      }`}
    >
      <span className="text-lg font-extrabold text-texte">{title}</span>
      <span className="text-sm leading-relaxed text-texte-2">{description}</span>
    </button>
  );
}
