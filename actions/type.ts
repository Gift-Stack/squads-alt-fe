import * as multisig from "@sqds/multisig";

export type Multisig = {
  address: string;
  account: {
    createKey: string;
    configAuthority: string;
    threshold: number;
    timeLock: number;
    transactionIndex: `${number}`;
    staleTransactionIndex: `${number}`;
    rentCollector: string;
    bump: number;
    members: MultisigMember[];
  };
  defaultVault: string;
  metadata: MultisigMetadata;
};

export type MultisigMetadata = {
  name: string;
  description: string;
  createdAt: number;
  image: string;
};

export type MultisigMember = {
  key: string;
  permissions: {
    mask: number;
  };
};

export type TransactionType = "ConfigTransaction" | "VaultTransaction";

export type Transaction<T extends TransactionType = TransactionType> = {
  type: T;
  address: string;
  account: {
    multisig: string;
    creator: string;
    index: number;
    bump: number;
    actions: (Exclude<multisig.generated.ConfigAction, "__kind"> & {
      type: multisig.generated.ConfigAction["__kind"];
    })[];
  };
  metadata: {
    info: {
      memo: string;
      createdTime: number;
      createdSignature: string;
      executedTime: number | null;
      executedSignature: string | null;
      thresholdAtCreation: number;
      votersAtCreation: number;
    };
    prevConfig: T extends "ConfigTransaction"
      ? {
          threshold: number;
          timeLock: number;
          members: multisig.generated.Member[];
          configAuthority: string;
        }
      : never;
    spendingLimitChanges: T extends "ConfigTransaction" ? [] : never;
    summary: T extends "VaultTransaction"
      ? {
          type: "Withdraw" | "Deposit";
          to: string;
          mint: string;
          symbol: string;
          amount: number;
          usd_value: null | number;
        }
      : never;
  };
  isReclaimed: boolean;
  unclaimedRent: number;
};

export type Proposal = {
  multisig: string;
  transactionIndex: number;
  status: {
    type: "Approved" | "Active" | "Executed";
    timestamp: number;
  };
  bump: number;
  approved: string[];
  rejected: string[];
  cancelled: string[];
};
