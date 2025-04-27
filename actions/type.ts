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
