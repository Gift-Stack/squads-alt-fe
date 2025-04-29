import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createSolanaClient } from "gill";

export function solanaClient() {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta")
  );
  return {
    ...createSolanaClient({
      urlOrMoniker: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "mainnet-beta",
    }),
    connection,
  };
}
