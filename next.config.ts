import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Garante que os CSV de fallback sejam incluídos no bundle serverless da
  // Vercel, já que lib/fonte/csv.ts lê os arquivos com fs.readFileSync em runtime.
  outputFileTracingIncludes: {
    "/**": ["./pecas.csv", "./aplicacoes.csv"],
  },
};

export default nextConfig;
