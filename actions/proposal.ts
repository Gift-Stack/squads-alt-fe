import { PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export const createProposalIx = ({
  multisigPda,
  transactionIndex,
  creator,
}: {
  multisigPda: string;
  transactionIndex: number;
  creator: string;
}) => {
  return multisig.instructions.proposalCreate({
    multisigPda: new PublicKey(multisigPda),
    transactionIndex: BigInt(transactionIndex),
    creator: new PublicKey(creator),
  });
};
