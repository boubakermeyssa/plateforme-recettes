import type { ButtonHTMLAttributes } from "react";

export function PrimaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`h-[58px] w-full rounded-full bg-sauge px-6 text-[17px] font-bold text-white shadow-bouton transition-colors hover:bg-sauge-fonce disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
