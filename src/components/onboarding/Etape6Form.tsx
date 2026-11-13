"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { erreurFiche, extensionFiche } from "@/lib/fiche";
import { PrimaryButton } from "@/components/ui";

export function Etape6Form() {
  const router = useRouter();
  const [fichier, setFichier] = useState<File | null>(null);
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    if (!fichier) {
      setErreur("Choisis ta fiche pour continuer.");
      return;
    }

    const erreurValidation = erreurFiche(fichier);
    const extension = extensionFiche(fichier.type);
    if (erreurValidation || !extension) {
      setErreur(erreurValidation ?? "Ce format de fichier n'est pas accepté.");
      return;
    }

    setEnCours(true);
    const supabase = createClient();
    let chemin: string | null = null;
    let ficheId: string | null = null;

    async function nettoyerImport() {
      if (ficheId) {
        try {
          await supabase.from("fiches_nutritionniste").delete().eq("id", ficheId);
        } catch {}
        ficheId = null;
      }
      if (chemin) {
        try {
          await supabase.storage.from("fiches").remove([chemin]);
        } catch {}
        chemin = null;
      }
    }

    try {
      const { data: { user }, error: erreurSession } = await supabase.auth.getUser();
      if (erreurSession || !user) {
        setErreur("Ta session a expiré. Reconnecte-toi puis réessaie.");
        return;
      }

      chemin = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: erreurUpload } = await supabase.storage.from("fiches").upload(chemin, fichier, {
        contentType: fichier.type,
        upsert: false,
      });
      if (erreurUpload) {
        await nettoyerImport();
        setErreur("L'import a échoué. Vérifie ta connexion puis réessaie.");
        return;
      }

      const { data: fiche, error: erreurEnregistrement } = await supabase
        .from("fiches_nutritionniste")
        .insert({ profil_id: user.id, fichier_path: chemin })
        .select("id")
        .single();
      if (erreurEnregistrement) {
        await nettoyerImport();
        setErreur("La fiche n'a pas pu être enregistrée. Réessaie.");
        return;
      }
      ficheId = fiche.id;

      const { error: erreurProfil } = await supabase
        .from("profils")
        .update({ onboarding_termine: true })
        .eq("id", user.id);
      if (erreurProfil) {
        await nettoyerImport();
        setErreur("La fiche a été importée mais la fin de l'inscription a échoué. Réessaie.");
        return;
      }

      router.replace("/recettes");
      router.refresh();
    } catch {
      await nettoyerImport();
      setErreur("Une erreur est survenue. Réessaie.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={envoyer} className="flex flex-1 flex-col justify-between gap-6">
      <div className="rounded-bloc bg-white p-5 shadow-carte">
        <label htmlFor="fiche-nutritionniste" className="mb-3 block text-sm font-bold">
          Fiche du ou de la nutritionniste
        </label>
        <input
          id="fiche-nutritionniste"
          name="fiche"
          type="file"
          accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const selection = e.target.files?.[0] ?? null;
            setFichier(selection);
            setErreur(selection ? erreurFiche(selection) ?? "" : "");
          }}
          className="block min-h-11 w-full text-sm file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-sauge-clair file:px-4 file:font-semibold file:text-sauge"
          aria-describedby="aide-fiche"
        />
        <p id="aide-fiche" className="mt-3 text-sm leading-relaxed text-texte-2">
          PDF, JPG ou PNG, jusqu&apos;à 10 Mo. Ton document reste privé et ne sera pas utilisé avant les prochaines étapes.
        </p>
        {fichier && <p className="mt-3 break-all text-sm font-semibold">{fichier.name}</p>}
      </div>

      <div className="flex flex-col gap-3">
        {erreur && <p role="alert" className="text-sm text-interdit">{erreur}</p>}
        <PrimaryButton type="submit" disabled={enCours}>
          {enCours ? "Import en cours…" : "Importer ma fiche"}
        </PrimaryButton>
      </div>
    </form>
  );
}
