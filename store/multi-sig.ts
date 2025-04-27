import { getMultisigAccount } from "@/actions/multisig";
import { useQuery } from "@tanstack/react-query";

export const useSquads = ({
  walletAddress,
}: {
  walletAddress: string | undefined;
}) => {
  return useQuery({
    queryKey: ["squads", walletAddress],
    queryFn: () => {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }
      return getMultisigAccount(walletAddress);
    },
    enabled: !!walletAddress,
  });
};

export const useSquad = ({
  walletAddress,
  squadId,
}: {
  walletAddress: string | undefined;
  squadId: string;
}) => {
  const { data: squads } = useSquads({ walletAddress });
  return useQuery({
    queryKey: ["squad", walletAddress, squadId],
    queryFn: () => {
      if (!squads) {
        throw new Error("Unable to fetch squads");
      }
      const squad = squads.find((squad) => squad.defaultVault === squadId);
      if (!squad) {
        throw new Error("Squad not found");
      }
      return squad;
    },
    enabled: !!walletAddress && !!squadId,
  });
};
