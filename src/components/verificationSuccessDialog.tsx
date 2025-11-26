"use client";

import { HandCoins } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: {
    projectId?: bigint | number;
    creditsMinted?: bigint | number;
  } | null;
  txHash: string;
}

export default function SuccessDialog({
  isOpen,
  onClose,
  eventData,
  txHash,
}: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <HandCoins className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Project Verified Successfully!
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            The project has been successfully verified on the blockchain.
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Project ID</p>
            <p className="text-white font-mono text-sm">
              {eventData?.projectId?.toString() || "N/A"}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Credits Minted</p>
            <p className="text-white font-mono text-sm">
              {eventData?.creditsMinted?.toString() || "N/A"}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
            <p className="text-green-400 font-mono text-xs break-all">
              {txHash}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
