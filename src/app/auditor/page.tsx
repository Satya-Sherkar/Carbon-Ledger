"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/constants";
import SuccessDialog from "@/components/verificationSuccessDialog";

export default function AuditorPage() {
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const [creditsToMint, setCreditsToMint] = useState<number | undefined>(
    undefined
  );
  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

  async function verifyProject(projectId: number, creditsToMint: number) {
    try {
      writeContract({
        abi: MARKETPLACE_ABI,
        address: MARKETPLACE_ADDRESS,
        functionName: "verifyProject",
        args: [projectId, creditsToMint],
      });
  
      // Save project details to database
      const response = await fetch("/api/verify-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, creditsToMint }),
      });
  
      if (response.ok) {
        console.log("Project verified successfully");
      } else {
        console.error("Failed to store in Database");
      }
  
      setEventData({
        projectId,
        creditsMinted: creditsToMint,
      });
  
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error verifying project:", error);
    }
    
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Verify Projects and Mint Credits
          </h1>
          <p className="text-gray-400 mt-2">
            As an auditor you can verify submitted projects and mint credits.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Project ID
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 77"
                value={projectId ?? ""}
                onChange={(e) =>
                  setProjectId(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Credits to Mint
              </label>
              <input
                required
                type="number"
                placeholder="Enter Credits to mint"
                value={creditsToMint ?? ""}
                onChange={(e) =>
                  setCreditsToMint(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() =>
                  projectId !== undefined &&
                  creditsToMint !== undefined &&
                  verifyProject(projectId, creditsToMint)
                }
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center justify-center"
              >
                {isConfirming ? (
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
                    Verifying Project...
                  </span>
                ) : isConfirmed ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Project Verified</span>
                  </span>
                ) : (
                  "Verify Project and Mint Credits"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      { isConfirmed && (<SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          setProjectId(undefined);
          setCreditsToMint(undefined);
        }}
        eventData={eventData}
        txHash={txHash || ""}
      />)}
    </div>
  );
}
