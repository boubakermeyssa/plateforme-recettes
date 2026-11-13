import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";

export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-between px-6 pb-10 pt-16">
      <div className="flex flex-col gap-4">
        <span className="w-fit rounded-full bg-peche-clair px-3 py-1 text-[13px] font-semibold text-alerte-texte">
          Recettes healthy · vidéo
        </span>
        <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-tight">{APP_NAME}</h1>
        <p className="text-base leading-relaxed text-texte-2">{APP_TAGLINE}</p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/connexion"
          className="flex h-[58px] w-full items-center justify-center rounded-full bg-sauge px-6 text-[17px] font-bold text-white shadow-bouton transition-colors hover:bg-sauge-fonce"
        >
          Commencer
        </Link>
        <p className="text-center text-xs leading-relaxed text-texte-2">
          Nos recettes ne remplacent pas un avis médical.
        </p>
      </div>
    </main>
  );
}
