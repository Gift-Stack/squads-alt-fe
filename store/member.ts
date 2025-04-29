import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as multisig from "@sqds/multisig";
import { solanaClient } from "@/lib/web3-utils";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { SolanaWallet } from "@dynamic-labs/solana-core";
import { getTransactionIndex } from "@/actions/transaction";
import { createProposalIx } from "@/actions/proposal";

const { Permission, Permissions } = multisig.types;

export const useMembers = () => {};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  const userWallets = useUserWallets() as SolanaWallet[];
  return useMutation({
    mutationKey: ["addMember"],
    mutationFn: async ({
      walletAddress,
      multisigAddress,
      memberAddress,
      permissions,
    }: {
      walletAddress: string;
      multisigAddress: string;
      memberAddress: string;
      permissions: {
        proposer: boolean;
        voter: boolean;
        executor: boolean;
      };
    }) => {
      const { rpc } = solanaClient();
      const wallet = userWallets.find((w) => w.address === walletAddress);

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const currentTransactionIndex = await getTransactionIndex(
        multisigAddress
      );
      const newTransactionIndex = BigInt(currentTransactionIndex + 1);

      const permissionsMask: (typeof Permission)[keyof typeof Permission][] =
        [];

      if (permissions.proposer) {
        permissionsMask.push(Permission.Initiate);
      }

      if (permissions.voter) {
        permissionsMask.push(Permission.Vote);
      }

      if (permissions.executor) {
        permissionsMask.push(Permission.Execute);
      }

      // Create a config transaction, of type changeThreshold
      const createConfigTransactionIx =
        multisig.instructions.configTransactionCreate({
          multisigPda: new PublicKey(multisigAddress),
          transactionIndex: newTransactionIndex,
          creator: new PublicKey(walletAddress),
          actions: [
            {
              __kind: "AddMember",
              newMember: {
                key: new PublicKey(memberAddress),
                permissions: Permissions.fromPermissions(permissionsMask),
              },
            },
          ],
        });

      const proposalIx = await createProposalIx({
        multisigPda: multisigAddress,
        transactionIndex: currentTransactionIndex,
        creator: walletAddress,
      });

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      const signer = await wallet.getSigner();

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(walletAddress),
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [createConfigTransactionIx, proposalIx],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const confirmation = await signer.signAndSendTransaction(
        transaction as any
      );

      return confirmation.signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["squads"] });
    },
  });
};
