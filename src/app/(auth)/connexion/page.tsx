"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PrimaryButton, TextField } from "@/components/ui";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"idle" | "envoi" | "envoye" | "erreur">("idle");

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setEtat(error ? "erreur" : "envoye");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-6 pb-10 pt-16">
      <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">Connexion</h1>
      <p className="mb-8 mt-2 text-[15px] leading-relaxed text-texte-2">
        Entre ton e-mail : on t&apos;envoie un lien pour te connecter, sans mot de passe.
      </p>

      {etat === "envoye" ? (
        <div className="rounded-carte bg-sauge-clair p-5 text-[15px] leading-relaxed text-sauge-fonce">
          C&apos;est envoyé ! Ouvre l&apos;e-mail reçu sur <strong>{email}</strong> et clique sur le lien.
        </div>
      ) : (
        <form onSubmit={envoyer} className="flex flex-1 flex-col justify-between gap-6">
          <TextField
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="toi@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex flex-col gap-3">
            {etat === "erreur" && (
              <p role="alert" className="text-sm text-interdit">
                L&apos;envoi a échoué. Vérifie ton e-mail et réessaie.
              </p>
            )}
            <PrimaryButton type="submit" disabled={etat === "envoi"}>
              {etat === "envoi" ? "Envoi…" : "Recevoir mon lien"}
            </PrimaryButton>
          </div>
        </form>
      )}
    </main>
  );
}
