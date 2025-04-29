import { Proposal, Transaction } from "@/actions/type";
import { useTransactions } from "@/store/transaction";
import { format } from "date-fns";
import { ArrowUpRight, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TransactionDetailsModal } from "@/modals/transaction-details-modal";

interface TransactionItemProps {
  transaction: Transaction;
  proposal: Proposal | null;
}

const Transactions = ({ vaultAddress }: { vaultAddress: string }) => {
  const { data: transactions } = useTransactions({
    vaultAddress,
  });

  if (!transactions) return null;

  console.log("transactionsSSS", transactions);

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <TransactionItem
          key={tx.transaction.address}
          transaction={tx.transaction}
          proposal={tx.proposal}
        />
      ))}
    </div>
  );
};

export default Transactions;

const TransactionItem = ({ transaction, proposal }: TransactionItemProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    if (transaction.metadata.info.executedTime) {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    }
    return <Clock className="h-5 w-5 text-amber-400" />;
  };

  const getStatusColor = () => {
    if (transaction.metadata.info.executedTime) return "text-green-400";
    if (proposal?.status.type === "Approved") return "text-amber-400";
    return "text-blue-400";
  };

  const getStatusText = () => {
    if (transaction.metadata.info.executedTime) return "Executed";
    if (proposal?.status.type === "Approved") return "Ready";
    return "Active";
  };

  const renderTransactionSummary = () => {
    switch (transaction.type) {
      case "VaultTransaction":
        return (
          <div className="flex items-center gap-2">
            {transaction.metadata.summary.type === "Withdraw" ? (
              <ArrowUpRight className="h-4 w-4 text-red-400" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-green-400 rotate-180" />
            )}
            <span>
              {transaction.metadata.summary.amount}{" "}
              {transaction.metadata.summary.symbol}
            </span>
            <span className="text-muted-foreground">
              to {transaction.metadata.summary.to.slice(0, 6)}...
            </span>
          </div>
        );

      case "ConfigTransaction":
        return (
          <div className="flex items-center gap-2">
            <span>Config Update</span>
            <span className="text-muted-foreground">
              {transaction.account.actions
                .map((action) => action.type.split(/(?=[A-Z])/).join(" "))
                .join(", ")}
            </span>
          </div>
        );
    }
  };

  return (
    <>
      <button onClick={() => setShowDetails(true)} className="w-full text-left">
        <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
          <div className="flex items-center gap-4">
            {/* Status Icon */}
            <div
              className={`p-2 rounded-full ${
                transaction.metadata.info.executedTime
                  ? "bg-green-900/20"
                  : "bg-amber-900/20"
              }`}
            >
              {getStatusIcon()}
            </div>

            {/* Transaction Summary */}
            <div className="space-y-1">
              {renderTransactionSummary()}
              <div className="text-sm text-muted-foreground">
                {format(
                  new Date(transaction.metadata.info.createdTime * 1000),
                  "h:mm a"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <Badge
              variant="outline"
              className={`${getStatusColor()} border-current`}
            >
              {getStatusText()}
            </Badge>

            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </button>

      <TransactionDetailsModal
        transaction={transaction}
        proposal={proposal}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};
