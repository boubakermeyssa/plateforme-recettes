export const MAX_TAILLE_FICHE = 10 * 1024 * 1024;

const EXTENSIONS_FICHE: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export function erreurFiche(fichier: Pick<Blob, "type" | "size">): string | null {
  if (!EXTENSIONS_FICHE[fichier.type]) return "Choisis un fichier PDF, JPG ou PNG.";
  if (fichier.size === 0) return "Ce fichier est vide.";
  if (fichier.size > MAX_TAILLE_FICHE) return "Le fichier ne doit pas dépasser 10 Mo.";
  return null;
}

export function extensionFiche(type: string): string | null {
  return EXTENSIONS_FICHE[type] ?? null;
}