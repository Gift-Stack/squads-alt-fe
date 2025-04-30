import React from "react";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { useRouter } from "next/navigation";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID!,
        walletConnectors: [SolanaWalletConnectors],

        events: {
          onLogout: () => {
            router.push("/");
          },
        },
      }}
    >
      {children}
      <DynamicWidget />
    </DynamicContextProvider>
  );
}
