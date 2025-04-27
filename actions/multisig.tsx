import { solanaClient } from "@/lib/web3-utils";
import * as multisig from "@sqds/multisig";
import { address } from "gill";
import { PublicKey } from "@solana/web3.js";
import { Multisig as MultisigType } from "./type";

const { Multisig } = multisig.accounts;

const SQUAD_V4_MULTISIG_ADDRESS = "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf";

export async function getMultisigAccount(userAddress: string) {
  try {
    const { connection, rpc } = solanaClient();

    //   const multisigPda = address(SQUAD_V4_MULTISIG_ADDRESS);
    //   const multisigPda = address(userAddress);

    const fetchheerr = await fetch(
      `https://v4-api.squads.so/multisigs/${userAddress}?useProd=true`
    );

    const data = (await fetchheerr.json()) as MultisigType[];

    // const createKey = new PublicKey(
    //   "ABTipDhtHVHznP9Hxav3AMLdhSJ3m8XNZHT6DpKRLmbf" // To be derived
    // );

    // const [multisigPda] = multisig.getMultisigPda({
    //   createKey,
    // });

    // CHKfzsg7EuwMVPmi5RXRurd9BEZQDPxFDYpMzHdLBbHQ

    // const multisigAccount = await Multisig.fromAccountAddress(
    //   connection,
    //   multisigPda
    // );

    // console.log("multisigAccount2.0", multisigAccount);

    // return { multisigAccount, multisigPda };
    return data;
  } catch (error) {
    console.log("Error getting multisig account", error);
    return [];
  }
}
