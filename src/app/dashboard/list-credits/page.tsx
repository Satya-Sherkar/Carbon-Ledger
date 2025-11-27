"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/constants";

export default function ListCreditsPage() {
  const { isConnected } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const [creditAmount, setCreditAmount] = useState<number | "">("");
  const [perCreditPrice, setPerCreditPrice] = useState<number | "">("");
  const [projectId, setProjectId] = useState<number | "">("");

  async function listCreditsForSell(
    creditAmountInput: number | "",
    perCreditPriceInput: number | ""
  ) {
    const amount = Number(creditAmountInput);
    const price = Number(perCreditPriceInput);

    if (!amount || amount <= 0 || !price || price <= 0) {
      alert("Please enter valid positive numbers for amount and price");
      return;
    }

    try {
      writeContract({
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: "listCreditsForSell",
        args: [amount, price],
      });

      // save listing data to database
      await fetch("/api/list-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creditAmount: amount,
          pricePerCredit: price,
          projectId: projectId,
        }),
      });
    } catch (err) {
      console.error("Error listing credits:", err);
    }
  }

  const isButtonDisabled =
    !isConnected ||
    isPending ||
    isConfirming ||
    Number(creditAmount) <= 0 ||
    Number(perCreditPrice) <= 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">List Carbon Credits</h1>
          <p className="text-gray-400 mt-2">
            Put your carbon credits up for sale on the marketplace.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Project ID
              </label>
              <input
                type="number"
                placeholder="Your Project ID"
                value={projectId}
                onChange={(e) =>
                  setProjectId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <label className="text-sm text-gray-300 block mb-2">
                Credit Amount
              </label>
              <input
                type="number"
                placeholder="Number of credits"
                value={creditAmount}
                onChange={(e) =>
                  setCreditAmount(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <label className="text-sm text-gray-300 block mb-2 mt-4">
                Price per Credit (in wei / smallest unit)
              </label>
              <input
                type="number"
                placeholder="Price per credit"
                value={perCreditPrice}
                onChange={(e) =>
                  setPerCreditPrice(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {!isConnected && (
              <p className="text-red-400 text-sm">
                Please connect your wallet first
              </p>
            )}

            {error && (
              <p className="text-red-400 text-sm">Error: {error.message}</p>
            )}

            <div>
              <button
                onClick={() => listCreditsForSell(creditAmount, perCreditPrice)}
                disabled={isButtonDisabled}
                className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {!isConnected ? (
                  "Connect Wallet"
                ) : isConfirming ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Listing Credits...
                  </span>
                ) : isConfirmed ? (
                  "Listed ✓"
                ) : isPending ? (
                  "Confirm in Wallet..."
                ) : (
                  "List Credits for Sale"
                )}
              </button>
            </div>

            {txHash && (
              <p className="text-green-400 text-sm break-all">
                Transaction Hash: {txHash}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
