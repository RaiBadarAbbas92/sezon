"use client";

// Hands the server-loaded catalogue (lib/catalog.ts) to client components such as the cart and header.
import { createContext, useContext } from "react";
import type { Catalog } from "./catalog";

const CatalogContext = createContext<Catalog | null>(null);

export function CatalogProvider({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}
