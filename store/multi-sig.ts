import { getMultisigAccount } from "@/actions/multisig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as multisig from "@sqds/multisig";
import {
  ComputeBudgetProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { SolanaWallet } from "@dynamic-labs/solana-core";
import { solanaClient } from "@/lib/web3-utils";

import Squads from "@sqds/multisig";
import { getTips, sendBundle } from "./functions";
import { pollingBundleInfo } from "./functions";
import { useWallet } from "@solana/wallet-adapter-react";

// Defines permissions enum
const { Permission, Permissions } = multisig.types;

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

export const useCreateSquad = () => {
  const queryClient = useQueryClient();
  const userWallets = useUserWallets() as SolanaWallet[];

  const { publicKey, connected, sendTransaction } = useWallet();

  return useMutation({
    mutationFn: async ({
      threshold,
      members,
    }: {
      threshold: number;
      members: {
        address: string;
        permissions: {
          proposer: boolean;
          voter: boolean;
          executor: boolean;
        };
      }[];
    }) => {
      const wallet = userWallets[0];

      if (!wallet || !publicKey || !connected) {
        throw Error("User is not logged in");
      }

      // const squads = Squads.
      console.log("wallet", { wallet, publicKey });

      const signer = await wallet.getSigner();
      const _ = await wallet.getConnection();
      const { rpc, connection } = solanaClient();

      // Random Public Key that will be used to derive a multisig PDA
      // This will need to be a signer on the transaction
      const createKey = Keypair.generate();

      // const creator = new PublicKey(wallet.address);
      const creator = publicKey;

      const [multisigPda] = multisig.getMultisigPda({
        createKey: createKey.publicKey,
      });

      const [programConfigPda] = multisig.getProgramConfigPda({});

      const programConfig =
        await multisig.accounts.ProgramConfig.fromAccountAddress(
          connection,
          programConfigPda
        );

      const configTreasury = programConfig.treasury;

      const mappedMembers = members.map(({ address, permissions }) => {
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
        return {
          key: new PublicKey(address),
          permissions: Permissions.fromPermissions(permissionsMask),
        };
      });

      console.log("mappedMembers", mappedMembers);

      // Create the multisig
      // const signatureTx = multisig.transactions.multisigCreateV2({
      //   // One time random Key
      //   createKey: createKey.publicKey,
      //   // The creator & fee payer
      //   creator: new PublicKey(wallet.address),
      //   multisigPda,
      //   configAuthority: null,
      //   timeLock: 0,
      //   members: [
      //     {
      //       // Creator of the multisig needs to be a member with all permissions
      //       key: new PublicKey(wallet.address),
      //       permissions: Permissions.all(),
      //     },
      //     ...mappedMembers,
      //   ],
      //   // This means that there needs to be 2 votes for a transaction proposal to be approved
      //   threshold: 2,
      //   rentCollector: null,
      //   treasury: configTreasury,
      //   blockhash: latestBlockhash.blockhash,
      // });

      // console.log("signatureTx", signatureTx);

      const ix = multisig.instructions.multisigCreateV2({
        createKey: createKey.publicKey,
        creator,
        multisigPda,
        configAuthority: null,
        timeLock: 0,
        members: [
          {
            // Creator of the multisig needs to be a member with all permissions
            key: creator,
            permissions: Permissions.all(),
          },
          ...mappedMembers,
        ],
        threshold,
        treasury: configTreasury,
        rentCollector: null,
        programId: multisig.PROGRAM_ID,
      });

      console.log("ix", ix);

      // const { value: latestBlockhash_ } = await rpc
      //   .getLatestBlockhash({
      //     commitment: "confirmed",
      //   })
      //   .send();

      // console.log("latestBlockhash_", latestBlockhash_);

      const tx = new Transaction().add(ix);

      tx.feePayer = creator;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      console.log("tx", tx);

      // const { signature } = await signer.signAndSendTransaction(tx as any, {
      //   skipPreflight: true,
      // });

      const signature = await sendTransaction(tx, connection, {
        skipPreflight: true,
        signers: [createKey],
      });

      console.log("Transaction signature", signature);

      let sent = false;
      const maxAttempts = 10;
      const delayMs = 1000;
      for (let attempt = 0; attempt <= maxAttempts && !sent; attempt++) {
        const status = await connection.getSignatureStatus(signature);
        if (status?.value?.confirmationStatus === "confirmed") {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          sent = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }

      // const messageV0_ = new TransactionMessage({
      //   payerKey: creator,
      //   recentBlockhash: latestBlockhash_.blockhash,

      //   instructions: [
      //     getTips(creator, 500000),
      //     priorityFeeInstruction_,
      //     computeUnitInstruction_,
      //     ix,
      //   ],
      // }).compileToV0Message();

      // const tx = new VersionedTransaction(messageV0_);

      // console.log("transaction", transaction);

      // const tx = new Transaction().add(ix);

      // console.log("tx", tx);

      // tx.feePayer = creator;
      // tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // const djhdhjbsks = await signer.signAndSendTransaction(tx, {
      //   // skipPreflight: true,
      // });

      // const signedTx = await signer.signTransaction(tx);

      // const { bundleId } = await sendBundle(signedTx.serialize());

      // const confirmation__ = await pollingBundleInfo(bundleId);

      // console.log("confirmation__", confirmation__);

      // const signedTrxxx = await signer.signTransaction(signatureTx);

      // signatureTx.sign([createKey]);

      // console.log("signedTrxxx", signedTrxxx);

      // const rawTransaction_ = signedTrxxx.serialize();

      // console.log("rawTransaction_");

      // const cc = await connection.sendRawTransaction(rawTransaction_, {
      //   skipPreflight: true,
      //   maxRetries: 10,
      //   preflightCommitment: "confirmed",
      // });

      // console.log("cc", cc);

      // signatureTx.sign([signer, createKey]);

      // return { done: true, confirmation__ };
      return { done: true };

      /**
       * Using the Instructions.multisigCreateV2 instruction
       */

      const [vaultPda] = multisig.getVaultPda({
        multisigPda,
        index: 0,
      });

      const transferInstruction = SystemProgram.transfer({
        // The transfer is being signed from the Squads Vault, that is why we use the VaultPda
        fromPubkey: creator,
        toPubkey: vaultPda,
        lamports: 0.0001 * LAMPORTS_PER_SOL,
      });

      const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5_000,
      });
      const computeUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 200_000,
      });

      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      const messageV0 = new TransactionMessage({
        payerKey: creator,
        recentBlockhash: latestBlockhash.blockhash,

        instructions: [ix],
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      console.log("transaction", transaction);
      const signedTrx = await signer.signTransaction(transaction as any);
      console.log("signedTrx", signedTrx);
      const rawTransaction = signedTrx.serialize();

      console.log("rawTransaction", rawTransaction);

      let blockHeight = await connection.getBlockHeight();

      let confirmation: string | undefined;

      while (blockHeight < latestBlockhash.lastValidBlockHeight) {
        confirmation = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          preflightCommitment: "confirmed",
        });

        console.log("confirmation", confirmation);
        await new Promise((r) => setTimeout(r, 500));

        blockHeight = await connection.getBlockHeight();
        console.log("blockHeight", {
          blockHeight,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
      }

      return confirmation;

      // const confirmation = await signer.signAndSendTransaction(
      //   transaction as any,
      //   {
      //     preflightCommitment: "confirmed",
      //     skipPreflight: true,
      //   }
      // );

      // return confirmation.signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["squads"] });
    },
    onError: (error) => {
      console.error("{{error}}", error);
    },
  });
};
