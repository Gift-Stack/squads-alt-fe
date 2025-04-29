import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddMember } from "@/store/member";
import { Multisig } from "@/actions/type";
import { toast } from "sonner";
import { shortenAddress } from "@/lib/utils";

export default function AddMemberModal({
  userWalletAddress,
  squad,
  open,
  onClose,
}: {
  userWalletAddress: string;
  squad: Multisig;
  open: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: addMember, isPending } = useAddMember();
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [permissions, setPermissions] = useState({
    proposer: true,
    voter: true,
    executor: true,
  });
  const [note, setNote] = useState("");
  const [noRedirect, setNoRedirect] = useState(false);

  const handlePermissionChange = (perm: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleSubmit = async () => {
    if (
      !!squad.account.members.find((member) => member.key === newMemberAddress)
    ) {
      toast.error("Member already exists");
      return;
    }

    const txSignature = await addMember({
      walletAddress: userWalletAddress,
      multisigAddress: squad.address,
      memberAddress: newMemberAddress,
      permissions,
    });

    toast.success(
      `Successfully added member: ${shortenAddress(newMemberAddress)}`,
      {
        description: (
          <a
            href={`https://explorer.solana.com/tx/${txSignature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View transaction
          </a>
        ),
      }
    );

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <Label className="flex flex-col gap-3">
            <span>Public address</span>
            <Input
              placeholder="Wallet address, .sol, .bonk, .abc, .poor or .glow"
              value={newMemberAddress}
              onChange={(e) => setNewMemberAddress(e.target.value)}
            />
          </Label>

          <div className="flex gap-4">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={permissions.proposer}
                onCheckedChange={() => handlePermissionChange("proposer")}
              />
              Proposer
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={permissions.voter}
                onCheckedChange={() => handlePermissionChange("voter")}
              />
              Voter
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={permissions.executor}
                onCheckedChange={() => handlePermissionChange("executor")}
              />
              Executor
            </Label>
          </div>

          <Input
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={noRedirect}
              onCheckedChange={() => setNoRedirect(!noRedirect)}
            />
            Create without redirect to tx list
          </Label>
          <div className="text-xs text-muted-foreground">
            Only add wallets that you fully control. Do not add CEX addresses,
            as they can't be used to sign transactions.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending ||
              !newMemberAddress.trim() ||
              (!permissions.executor &&
                !permissions.proposer &&
                !permissions.voter)
            }
          >
            {isPending ? "Initiating transaction..." : "Initiate transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
