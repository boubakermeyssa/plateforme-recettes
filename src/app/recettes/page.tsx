import Link from "next/link";

// Le flux de recettes arrive avec l'epic E5.
export default function Recettes() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-4 px-6">
      <h1 className="text-[32px] font-extrabold tracking-tight">Ton profil est prêt</h1>
      <p className="text-texte-2">Tes recettes personnalisées arrivent bientôt ici.</p>
      <Link href="/profil" className="font-semibold text-sauge underline-offset-2 hover:underline">
        Voir mon profil
      </Link>
    </main>
  );
}
