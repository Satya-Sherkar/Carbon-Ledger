"use client";

import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/constants";
import { useState } from "react";
import { Flame, CheckCircle2, Loader2 } from "lucide-react";

export default function RetireCreditsPage() {
  const { isConnected } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const [amount, setAmount] = useState<number | "">("");
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  async function retireCredits(amountInput: number | "") {
    const creditAmount = Number(amountInput);

    if (!creditAmount || creditAmount <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    writeContract({
      abi: MARKETPLACE_ABI,
      address: MARKETPLACE_ADDRESS,
      functionName: "retireCredit",
      args: [creditAmount],
    });
  }

  const isButtonDisabled =
    !isConnected || isPending || isConfirming || Number(amount) <= 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-800/20 p-3 rounded-lg">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Retire Carbon Credits
            </h1>
          </div>
          <p className="text-gray-400 mt-2">
            Permanently retire your carbon credits to offset your carbon
            footprint.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Credit Amount to Retire
              </label>
              <input
                type="number"
                placeholder="Enter number of credits"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <p className="text-gray-400 text-xs mt-2">
                Retired credits are permanently removed from circulation and
                cannot be traded.
              </p>
            </div>

            {!isConnected && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">
                  Please connect your wallet first
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">Error: {error.message}</p>
              </div>
            )}

            {isConfirmed && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-400 text-sm font-medium">
                  Credits retired successfully!
                </p>
              </div>
            )}

            <div>
              <button
                onClick={() => retireCredits(amount)}
                disabled={isButtonDisabled}
                className="w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {!isConnected ? (
                  <>
                    <span>Connect Wallet</span>
                  </>
                ) : isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Confirming Transaction...</span>
                  </>
                ) : isConfirmed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Credits Retired ✓</span>
                  </>
                ) : isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Confirm in Wallet...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5" />
                    <span>Retire Credits</span>
                  </>
                )}
              </button>
            </div>

            {txHash && (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-gray-300 mb-1">Transaction Hash:</p>
                <p className="text-emerald-400 text-sm break-all font-mono">
                  {txHash}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
