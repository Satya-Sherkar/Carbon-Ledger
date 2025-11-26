"use client";

import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useWatchContractEvent,
  useReadContract,
} from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/constants";
import SuccessDialog from "@/components/successDialog";

export default function RegisterProject() {
  const { isConnected } = useAccount();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const [projectName, setProjectName] = useState<string>("");
  const [projectOwnerAddress, setProjectOwnerAddress] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectOwnerEmail, setProjectOwnerEmail] = useState<string>("");

  // Dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    eventName: "ProjectRegistered",
    onLogs: (logs) => {
      console.log("Project Registered Event Logs:", logs);

      if (logs.length > 0) {
        const latestLog = logs[logs.length - 1] as any;
        // Extract event data from the log
        setEventData({
          projectId: latestLog.args?.projectId,
          projectName: latestLog.args?.projectName,
          owner: latestLog.args?.owner,
        });
        setShowSuccessDialog(true);
      }
    },
  });

  const { data: nextProjectId } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "nextProjectId",
  });

  async function registerProject(
    projectName: string,
    projectOwner: string,
    projectDescription: string,
    projectOwnerEmail: string
  ) {
    if (!projectName || !projectOwner) {
      alert("Please fill in all fields");
      return;
    }

    writeContract({
      abi: MARKETPLACE_ABI,
      address: MARKETPLACE_ADDRESS,
      functionName: "registerProject",
      args: [projectName, projectOwner],
    });

    const body = {
      title: projectName,
      ownerWalletAddress: projectOwner,
      description: projectDescription,
      ownerEmail: projectOwnerEmail,
      projectId: nextProjectId?.toString(),
    };

    // save additional project details to your backend or database here
    await fetch("/api/register-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  const isButtonDisabled =
    !isConnected ||
    isPending ||
    isConfirming ||
    !projectName ||
    !projectOwnerAddress;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Register your project
          </h1>
          <p className="text-gray-400 mt-2">
            Submit your carbon credit project for verification.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Project Name/ Title
              </label>
              <input
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <label className="text-sm text-gray-300 block mb-2 mt-4">
                Project Description
              </label>
              <input
                type="text"
                placeholder="Enter Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Project Owner Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={projectOwnerAddress}
                onChange={(e) => setProjectOwnerAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <label className="text-sm text-gray-300 block mb-2 mt-4">
                Project Owner Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={projectOwnerEmail}
                onChange={(e) => setProjectOwnerEmail(e.target.value)}
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
                onClick={() =>
                  registerProject(
                    projectName,
                    projectOwnerAddress,
                    projectDescription,
                    projectOwnerEmail
                  )
                }
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
                    Registering Project...
                  </span>
                ) : isConfirmed ? (
                  "Project Registered ✓"
                ) : isPending ? (
                  "Confirm in Wallet..."
                ) : (
                  "Register Project"
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

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          // Reset form
          setProjectName("");
          setProjectOwnerAddress("");
          setProjectDescription("");
          setProjectOwnerEmail("");
        }}
        eventData={eventData}
        txHash={txHash || ""}
      />
    </div>
  );
}
