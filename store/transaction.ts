import { createProposalIx } from "@/actions/proposal";
import * as multisig from "@sqds/multisig";
import { Proposal, TransactionType } from "@/actions/type";
import { Transaction } from "@/actions/type";
import { solanaClient } from "@/lib/web3-utils";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { SolanaWallet } from "@dynamic-labs/solana-core";
import {
  AddressLookupTableAccount,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useTransactions = ({ vaultAddress }: { vaultAddress: string }) => {
  const { data, ...infiniteQuery } = useInfiniteQuery({
    queryKey: ["transactions", vaultAddress],
    queryFn: async ({ pageParam }) => {
      const fetchheerr = await fetch(
        `https://v4-api.squads.so/transactionsPaginated/${vaultAddress}?page=${pageParam}`
      );

      const data = (await fetchheerr.json()) as {
        totalPages: number;
        transactions: {
          transaction: Transaction;
          proposal: Proposal | null;
        }[];
      };

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.totalPages > 50 ? undefined : lastPage.totalPages + 1,
    enabled: !!vaultAddress,
  });

  return {
    data: data?.pages.flatMap((page) => page.transactions),
    ...infiniteQuery,
  };
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();
  const userWallets = useUserWallets() as SolanaWallet[];
  return useMutation({
    mutationFn: async ({
      transactionIndex,
      multisigPda,
    }: {
      transactionIndex: number;
      multisigPda: string;
    }) => {
      const { rpc } = solanaClient();
      const wallet = userWallets[0];

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const proposalIx = createProposalIx({
        transactionIndex,
        multisigPda,
        creator: wallet.address,
      });

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      const signer = await wallet.getSigner();

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(wallet.address),
        instructions: [proposalIx],
        recentBlockhash: latestBlockhash.blockhash,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const confirmation = await signer.signAndSendTransaction(
        transaction as any
      );

      return confirmation.signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error("Transaction failed", {
        description: error.message,
      });
    },
  });
};

export const useApproveProposal = () => {
  const queryClient = useQueryClient();
  const userWallets = useUserWallets() as SolanaWallet[];
  return useMutation({
    mutationFn: async ({
      transactionIndex,
      multisigPda,
    }: {
      transactionIndex: number;
      multisigPda: string;
    }) => {
      const { rpc } = solanaClient();
      const wallet = userWallets[0];

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const proposalIx = multisig.instructions.proposalApprove({
        transactionIndex: BigInt(transactionIndex),
        multisigPda: new PublicKey(multisigPda),
        member: new PublicKey(wallet.address),
      });

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      const signer = await wallet.getSigner();

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(wallet.address),
        instructions: [proposalIx],
        recentBlockhash: latestBlockhash.blockhash,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const confirmation = await signer.signAndSendTransaction(
        transaction as any
      );

      return confirmation.signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error("Transaction failed", {
        description: error.message,
      });
    },
  });
};

export const useCreateAndApproveProposal = () => {
  const queryClient = useQueryClient();
  const userWallets = useUserWallets() as SolanaWallet[];
  return useMutation({
    mutationFn: async ({
      transactionIndex,
      multisigPda,
    }: {
      transactionIndex: number;
      multisigPda: string;
    }) => {
      const { rpc } = solanaClient();
      const wallet = userWallets[0];

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const _createProposalIx = createProposalIx({
        transactionIndex,
        multisigPda,
        creator: wallet.address,
      });

      const approveProposalIx = multisig.instructions.proposalApprove({
        transactionIndex: BigInt(transactionIndex),
        multisigPda: new PublicKey(multisigPda),
        member: new PublicKey(wallet.address),
      });

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      const signer = await wallet.getSigner();

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(wallet.address),
        instructions: [_createProposalIx, approveProposalIx],
        recentBlockhash: latestBlockhash.blockhash,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      const confirmation = await signer.signAndSendTransaction(
        transaction as any
      );

      return confirmation.signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error("Transaction failed", {
        description: error.message,
      });
    },
  });
};

export const useExecuteProposal = () => {
  const queryClient = useQueryClient();
  const userWallets = useUserWallets() as SolanaWallet[];

  return useMutation({
    mutationFn: async ({
      transactionIndex,
      multisigPda,
      type,
    }: {
      transactionIndex: number;
      multisigPda: string;
      type: TransactionType;
    }) => {
      const { rpc, connection } = solanaClient();
      const wallet = userWallets[0];

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const payload = {
        transactionIndex: BigInt(transactionIndex),
        multisigPda: new PublicKey(multisigPda),
        member: new PublicKey(wallet.address),
      };

      let instructionAndLookupTableAccounts: {
        instruction: TransactionInstruction;
        lookupTableAccounts: AddressLookupTableAccount[] | null;
      };

      if (type === "ConfigTransaction") {
        instructionAndLookupTableAccounts = {
          instruction: multisig.instructions.configTransactionExecute(payload),
          lookupTableAccounts: null,
        };
      } else {
        instructionAndLookupTableAccounts =
          await multisig.instructions.vaultTransactionExecute({
            ...payload,
            connection,
          });
      }

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      const signer = await wallet.getSigner();

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(wallet.address),
        instructions: [instructionAndLookupTableAccounts.instruction],
        recentBlockhash: latestBlockhash.blockhash,
      }).compileToV0Message(
        instructionAndLookupTableAccounts.lookupTableAccounts ?? undefined
      );

      const transaction = new VersionedTransaction(messageV0);

      const confirmation = await signer.signAndSendTransaction(
        transaction as any
      );

      return confirmation.signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error("Transaction failed", {
        description: error.message,
      });
    },
  });
};
