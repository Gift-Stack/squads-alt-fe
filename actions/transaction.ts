import { solanaClient } from "@/lib/web3-utils";
import { PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export const getTransactionIndex = async (multisigPda: string) => {
  const { connection } = solanaClient();
  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    new PublicKey(multisigPda)
  );

  const transactionIndex = Number(multisigInfo.transactionIndex);

  return transactionIndex;
};
