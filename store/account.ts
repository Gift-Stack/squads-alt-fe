import { useQuery } from "@tanstack/react-query";

export const useBalances = ({
  walletAddress,
}: {
  walletAddress: string | undefined;
}) => {
  return useQuery({
    queryKey: ["balances", walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet address and squad ID are required");
      }
      const { balances } = await getBalances(walletAddress);

      const totalUsd = balances.reduce((acc, balance) => {
        return acc + balance.uiPrice;
      }, 0);

      return { totalUsd, balances };
    },
    enabled: !!walletAddress,
  });
};

async function getBalances(walletAddress: string) {
  const response = await fetch(
    `https://v4-api.squads.so/balancesDasV2/${walletAddress}?sendAll=true&cacheBypass=false&useProd=true`
  );
  return response.json() as Promise<{ balances: Balance[] }>;
}

export type Balance = {
  amount: number;
  pricePerUnit: number;
  uiAmount: number;
  uiPrice: number;
  source: string;
  mint: string;
  symbol: string;
  decimals: number;
  wrapped: boolean;
  logoUri: string;
  name: string;
};
