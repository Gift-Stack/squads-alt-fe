import { PublicKey } from "@solana/web3.js";

import { SystemProgram } from "@solana/web3.js";

import axios from "axios";
import { encode } from "@coral-xyz/anchor/dist/cjs/utils/bytes/bs58";

export const JITO_ENDPOINT =
  "https://mainnet.block-engine.jito.wtf/api/v1/bundles";

/**@description argument should be encode(rawTransaction) */
export async function sendBundle(rawTx: Uint8Array | number[] | Buffer) {
  const result = await axios.post(JITO_ENDPOINT, {
    jsonrpc: "2.0",
    id: 1,
    method: "sendBundle",
    params: [[encode(rawTx)]],
  });
  const data = await result.data;
  console.log(
    { data: result.data.result, encodeRawTx: encode(rawTx) },
    "bundleId"
  );
  return { bundleId: data.result };
}

export async function pollingBundleInfo(bundleId: string, count = 9) {
  for await (const i of Array(count).keys()) {
    const { signature, status } = await getBundleInfo(bundleId);
    if (status === "finalized" || status === "confirmed") {
      return { signature, status }; // pretend it is finalized, to avoid fixing other status
    }
    if (i > 9) {
      return { signature, status };
    }
    await new Promise((resolve) => setTimeout(resolve, 6000)); // Try again in 5s // 6s
  }
}

/**@description do polling to get updated bundle info:  https://jito-labs.gitbook.io/mev/searcher-resources/json-rpc-api-reference/bundles/getbundlestatuses */
export async function getBundleInfo(bundleId: string) {
  try {
    const d = await axios.post(JITO_ENDPOINT, {
      jsonrpc: "2.0",
      id: 1,
      method: "getBundleStatuses",
      params: [[bundleId]],
    });

    const data = await d.data;

    console.log(data, "bundleResult", JSON.stringify(data));
    if (data.result.value.length === 0) return { signature: "", status: "" };
    return {
      signature: (data.result.value?.[0]?.transactions?.[0] || "") as string,
      status: data.result.value?.[0]?.confirmation_status as
        | "finalized"
        | "confirmed"
        | "processed",
    };
  } catch (err) {
    // if there is error, throw finalzied with empty signature
    return { signature: "", status: "finalized" };
  }
}

export function getTips(accountId: string | PublicKey, lamports = 4000000) {
  //0.000035
  //0.015 -> 15000000  // please add this one
  return SystemProgram.transfer({
    toPubkey: new PublicKey("96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5"),
    fromPubkey: new PublicKey(accountId),
    lamports,
  });
}
