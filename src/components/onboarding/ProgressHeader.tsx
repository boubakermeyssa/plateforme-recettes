import Link from "next/link";
import { TOTAL_ETAPES } from "@/lib/onboarding";

type Props = { etape: number; titre: string; sousTitre: string };

export function ProgressHeader({ etape, titre, sousTitre }: Props) {
  const retour = etape > 1 ? `/onboarding/${etape - 1}` : "/";
  return (
    <header>
      <div className="flex items-center gap-3">
        <Link
          href={retour}
          aria-label="Retour"
          className="flex size-11 items-center justify-center rounded-full bg-white shadow-carte"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div
          className="h-1.5 flex-1 rounded-full bg-piste"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_ETAPES}
          aria-valuenow={etape}
          aria-label={`Étape ${etape} sur ${TOTAL_ETAPES}`}
        >
          <div className="h-1.5 rounded-full bg-peche transition-all" style={{ width: `${(etape / TOTAL_ETAPES) * 100}%` }} />
        </div>
        <span className="text-[13px] font-semibold text-texte-2">
          {etape}/{TOTAL_ETAPES}
        </span>
      </div>
      <h1 className="mb-2 mt-7 text-[32px] font-extrabold leading-[1.15] tracking-tight">{titre}</h1>
      <p className="mb-6 text-[15px] leading-relaxed text-texte-2">{sousTitre}</p>
    </header>
  );
}
