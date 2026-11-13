import { describe, expect, it } from "vitest";
import { erreurFiche, extensionFiche, MAX_TAILLE_FICHE } from "@/lib/fiche";

describe("validation de la fiche nutritionniste", () => {
  it.each([
    ["application/pdf", "pdf"],
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
  ])("accepte %s", (type, extension) => {
    expect(erreurFiche({ type, size: 1024 })).toBeNull();
    expect(extensionFiche(type)).toBe(extension);
  });

  it("refuse les formats non pris en charge", () => {
    expect(erreurFiche({ type: "text/plain", size: 1024 })).toContain("PDF");
    expect(extensionFiche("text/plain")).toBeNull();
  });

  it("accepte exactement 10 Mo et refuse au-delà", () => {
    expect(erreurFiche({ type: "application/pdf", size: MAX_TAILLE_FICHE })).toBeNull();
    expect(erreurFiche({ type: "application/pdf", size: MAX_TAILLE_FICHE + 1 })).toContain("10 Mo");
  });

  it("refuse les fichiers vides", () => {
    expect(erreurFiche({ type: "image/png", size: 0 })).toContain("vide");
  });
});