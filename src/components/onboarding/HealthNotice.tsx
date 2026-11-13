export function HealthNotice() {
  return (
    <div role="note" className="flex gap-2.5 rounded-carte bg-alerte-fond p-3.5 text-[13px] leading-relaxed text-alerte-texte">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-none text-alerte-icone">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
      <span>
        Parles-en à un professionnel de santé avant de changer ton alimentation. Nos recettes ne remplacent pas un
        avis médical.
      </span>
    </div>
  );
}
