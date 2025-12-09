"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/constants";
import { Address } from "viem";
import { Wallet, ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const { isConnected, address } = useAccount();
  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });
  const [auditorAddress, setAuditorAddress] = useState("");
  const [actionType, setActionType] = useState<"add" | "remove" | null>(null);

  function addAuditor(adrs: Address) {
    setActionType("add");
    writeContract({
      abi: MARKETPLACE_ABI,
      address: MARKETPLACE_ADDRESS,
      functionName: "addAuditor",
      args: [adrs],
    });
  }

  function removeAuditor(adrs: Address) {
    setActionType("remove");
    writeContract({
      abi: MARKETPLACE_ABI,
      address: MARKETPLACE_ADDRESS,
      functionName: "removeAuditor",
      args: [adrs],
    });
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95">
        <div className="flex flex-col items-center p-8 rounded-xl bg-yellow-900/40 backdrop-blur-sm border border-yellow-800/50 text-yellow-300">
          <Wallet className="h-12 w-12 mb-4" />
          <p className="text-xl font-semibold">Connect to your wallet</p>
          <p className="text-sm mt-2 text-yellow-400">Please connect your wallet to access this page.</p>
        </div>
      </div>
    );
  }

  if (isConnected && address !== "0xA2032c43F562B7dd7e7A7A3F36f121Ad7D5265E2") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95">
        <div className="flex flex-col items-center p-8 rounded-xl bg-red-900/40 backdrop-blur-sm border border-red-800/50 text-red-300">
          <ShieldAlert className="h-12 w-12 mb-4" />
          <p className="text-xl font-semibold">Access Denied</p>
          <p className="text-sm mt-2 text-red-400">Only the administrator can access this page.</p>
        </div>
      </div>
    );
  }

  if (isConnected && address == "0xA2032c43F562B7dd7e7A7A3F36f121Ad7D5265E2") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Manage auditors and their permissions for the carbon marketplace.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Auditor Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={auditorAddress}
                  onChange={(e) => setAuditorAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => addAuditor(auditorAddress as Address)}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isConfirming && actionType === "add" ? (
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
                      Adding Auditor...
                    </span>
                  ) : isConfirmed && actionType === "add" ? (
                    "Auditor Added"
                  ) : (
                    "Add Auditor"
                  )}
                </button>
                <button
                  onClick={() => removeAuditor(auditorAddress as Address)}
                  className="px-6 py-3 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 font-semibold hover:bg-red-500/30 transition-all"
                >
                  {isConfirming && actionType === "remove" ? (
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
                      Removing Auditor...
                    </span>
                  ) : isConfirmed && actionType === "remove" ? (
                    "Auditor Removed"
                  ) : (
                    "Remove Auditor"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
