import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function TextField({ label, id, className = "", ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-2">
      <span className="text-[13px] font-bold uppercase tracking-wider text-texte-2">{label}</span>
      <input
        id={inputId}
        className={`h-[52px] w-full rounded-carte bg-white px-4 text-base text-texte shadow-carte placeholder:text-texte-2/70 disabled:opacity-50 ${className}`}
        {...props}
      />
    </label>
  );
}
