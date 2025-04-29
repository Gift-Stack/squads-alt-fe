import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Proposal, Transaction } from "@/actions/type";
import { cn, shortenAddress } from "@/lib/utils";
import {
  useApproveProposal,
  useCreateAndApproveProposal,
  useExecuteProposal,
} from "@/store/transaction";
import { toast } from "sonner";

interface TransactionDetailsModalProps {
  transaction: Transaction;
  proposal: Proposal | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailsModal({
  transaction,
  proposal,
  open,
  onClose,
}: TransactionDetailsModalProps) {
  const { mutateAsync: approveProposal, isPending: isApproving } =
    useApproveProposal();
  const { mutateAsync: createAndApproveProposal } =
    useCreateAndApproveProposal();

  const { mutateAsync: executeProposal, isPending: isExecuting } =
    useExecuteProposal();

  const handleApproveProposal = async () => {
    const payload = {
      transactionIndex: transaction.account.index,
      multisigPda: transaction.account.multisig,
    };

    let signature: string;
    if (proposal) {
      signature = await approveProposal(payload);
    } else {
      signature = await createAndApproveProposal(payload);
    }

    toast.success("Transaction approved successfully", {
      description: (
        <div className="flex items-center gap-2">
          <a
            href={`https://explorer.solana.com/tx/${signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View transaction
          </a>
        </div>
      ),
    });
  };

  const handleExecuteProposal = async () => {
    const signature = await executeProposal({
      transactionIndex: transaction.account.index,
      multisigPda: transaction.account.multisig,
      type: transaction.type,
    });

    toast.success("Transaction executed successfully", {
      description: (
        <div className="flex items-center gap-2">
          <a
            href={`https://explorer.solana.com/tx/${signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View transaction
          </a>
        </div>
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        {/* Risk Scanner */}
        <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Risk Scanner</span>
          </div>
          <p className="text-sm text-emerald-300 mt-1">
            No risk detected. It is still recommended to check all instructions
            manually.
          </p>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Author</p>
              <p className="font-medium">
                {shortenAddress(transaction.account.creator)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created on</p>
              <p className="font-medium">
                {format(
                  new Date(transaction.metadata.info.createdTime * 1000),
                  "MMM d, yyyy, h:mm a"
                )}
              </p>
            </div>
          </div>

          {transaction.type === "VaultTransaction" && (
            <div className="space-y-4">
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold">
                    {transaction.metadata.summary.amount}{" "}
                    {transaction.metadata.summary.symbol}
                  </p>
                  {transaction.metadata.summary.usd_value && (
                    <p className="text-sm text-muted-foreground">
                      ≈ ${transaction.metadata.summary.usd_value.toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recipient</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {shortenAddress(transaction.metadata.summary.to)}
                    </p>
                    <Button variant="ghost" size="icon" className="h-4 w-4">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Progress</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Transaction created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(transaction.metadata.info.createdTime),
                      "MMM d, yyyy, h:mm a"
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className="text-green-400 border-current"
                  >
                    Confirmed
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Clock
                    className={cn("h-4 w-4", {
                      "text-green-400": proposal?.status.type === "Approved",
                      "text-muted-foreground":
                        proposal?.status.type === "Active",
                    })}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Voting</p>
                  <p className="text-sm text-muted-foreground">
                    {proposal?.approved.length || 0}/
                    {transaction.metadata.info.thresholdAtCreation} approved
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={cn("border-muted-foreground", {
                      "text-green-400 border-current": [
                        "Approved",
                        "Executed",
                      ].includes(proposal?.status.type || ""),
                      "border-muted-foreground":
                        proposal?.status.type === "Active",
                    })}
                  >
                    {proposal?.status.type === "Active"
                      ? "Pending"
                      : "Confirmed"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            {proposal?.status?.type !== "Executed" && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            )}

            {proposal?.status?.type === "Executed" && (
              <a
                href={`https://explorer.solana.com/tx/${transaction.metadata.info.executedSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  View transaction
                </Button>
              </a>
            )}

            {proposal?.status.type === "Approved" && (
              <Button
                className="flex-1 flex items-center gap-2"
                onClick={handleExecuteProposal}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  "Execute"
                )}
              </Button>
            )}

            {(!proposal || proposal.status.type === "Active") && (
              <Button className="flex-1" onClick={handleApproveProposal}>
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
