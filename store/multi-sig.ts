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
import {
  address,
  addSignersToTransactionMessage,
  createTransaction,
  signTransaction,
  signTransactionMessageWithSigners,
  TransactionSigner,
} from "gill";
import { getAddMemoInstruction } from "gill/programs";

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

      if (!wallet) {
        throw Error("User is not logged in");
      }
      const { rpc, connection, sendAndConfirmTransaction } = solanaClient();

      // Random Public Key that will be used to derive a multisig PDA
      // This will need to be a signer on the transaction
      const createKey = Keypair.generate().publicKey;

      const creator = new PublicKey(wallet.address);

      const [multisigPda] = multisig.getMultisigPda({
        createKey,
      });

      const programConfigPda = multisig.getProgramConfigPda({})[0];

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

      const ix = multisig.instructions.multisigCreateV2({
        createKey,
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
      });

      const [vaultPda] = multisig.getVaultPda({
        multisigPda,
        index: 0,
      });

      // const transferInstruction = SystemProgram.transfer({
      //   // The transfer is being signed from the Squads Vault, that is why we use the VaultPda
      //   fromPubkey: vaultPda,
      //   toPubkey: creator.publicKey,
      //   lamports: 0.001 * LAMPORTS_PER_SOL,
      // });

      const signer = await wallet.getSigner();

      // const blockhashAndContext =
      //   await connection.getLatestBlockhashAndContext();
      // await rpc.getBlockHeight
      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({
          commitment: "confirmed",
        })
        .send();

      // console.log("latestBlockhash", latestBlockhash);

      const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5000,
      });
      const computeUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 200_000,
      });

      const memoIx = getAddMemoInstruction({ memo: "This is a test memo" });

      const signerWithAddress = {
        ...signer,
        address: address(wallet.address),
      };

      const transaction = createTransaction({
        feePayer: signerWithAddress as unknown as TransactionSigner,

        // recentBlockhash: latestBlockhash.blockhash,
        latestBlockhash,
        version: "legacy",
        computeUnitLimit: 200_000,
        computeUnitPrice: 5000,
        instructions: [memoIx],
      });

      // const messageV0 = new TransactionMessage({
      //   payerKey: creator,
      //   recentBlockhash: latestBlockhash.blockhash,

      //   instructions: [priorityFeeInstruction, computeUnitInstruction, ix],
      // }).compileToV0Message();

      // const transaction = new VersionedTransaction(messageV0);

      console.log("transactionIamHere", { signer, signerWithAddress });

      const signedTrx = await signTransactionMessageWithSigners(transaction);
      console.log("signedTrx", signedTrx);
      const rawTransaction = signedTrx.messageBytes;

      let blockHeight = await connection.getBlockHeight();

      let confirmation: string | undefined;

      while (blockHeight < latestBlockhash.lastValidBlockHeight) {
        confirmation = await sendAndConfirmTransaction(signedTrx, {
          preflightCommitment: "confirmed",
          commitment: "confirmed",
          skipPreflight: true,
        });
        // confirmation = await connection.sendRawTransaction(rawTransaction, {
        //   skipPreflight: true,
        //   preflightCommitment: "confirmed",
        // });
        await new Promise((r) => setTimeout(r, 500));
        blockHeight = await connection.getBlockHeight();
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
  });
};
