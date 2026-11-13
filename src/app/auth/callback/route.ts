import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profil } = await supabase
        .from("profils")
        .select("onboarding_termine")
        .eq("id", user!.id)
        .single();
      return NextResponse.redirect(`${origin}${profil?.onboarding_termine ? "/recettes" : "/onboarding"}`);
    }
  }
  return NextResponse.redirect(`${origin}/connexion`);
}
