"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function retirerConsentement() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await supabase
    .from("profils")
    .update({ consentement_sante: false, consentement_date: null, poids_kg: null, taille_cm: null })
    .eq("id", user.id);
  redirect("/profil");
}

export async function deconnexion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function supprimerCompte(formData: FormData) {
  if (formData.get("confirmation") !== "SUPPRIMER") redirect("/profil?erreur=confirmation");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  // Fichiers de la fiche nutritionniste (bucket privé), s'il y en a
  const { data: fichiers } = await admin.storage.from("fiches").list(user.id);
  if (fichiers?.length) await admin.storage.from("fiches").remove(fichiers.map((f) => `${user.id}/${f.name}`));
  // Supprime l'utilisateur : les tables du profil suivent en cascade
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) redirect("/profil?erreur=suppression");

  await supabase.auth.signOut();
  redirect("/?compte=supprime");
}
