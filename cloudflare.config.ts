import { defineConfig } from "cf/config";

export default defineConfig({
  // scragz account (owns the judetopia.com zone)
  accountId: "5af20bc0e5d9af83c1b9c52cfbb70667",
  worker: {
    name: "judetopia",
    compatibilityDate: "2026-11-17",
    domains: ["judetopia.com", "www.judetopia.com"],
    assets: {
      htmlHandling: "auto-trailing-slash",
      notFoundHandling: "none",
    },
    observability: {
      enabled: true,
    },
  },
});
