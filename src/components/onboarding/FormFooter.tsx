import { PrimaryButton } from "@/components/ui";

export function FormFooter({ erreur, enCours, texte = "Continuer" }: { erreur: string; enCours: boolean; texte?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {erreur && (
        <p role="alert" className="text-sm text-interdit">
          {erreur}
        </p>
      )}
      <PrimaryButton type="submit" disabled={enCours}>
        {enCours ? "Enregistrement…" : texte}
      </PrimaryButton>
    </div>
  );
}
