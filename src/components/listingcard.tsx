"use client";

import { formatEther } from "viem";
import { Leaf, User, DollarSign } from "lucide-react";
import { useWriteContract } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../constants";

interface Listing {
  credits: bigint;
  seller: string;
  pricePerCredit: bigint;
  isActive: boolean;
}

interface ListingCardProps {
  listing: Listing;
  listingId: number;
}

export function ListingCard({ listing, listingId }: ListingCardProps) {
  const { credits, seller, pricePerCredit, isActive } = listing;

  const totalPrice = (
    Number(credits) * Number(formatEther(pricePerCredit))
  ).toFixed(4);
  const formattedPrice = formatEther(pricePerCredit);

  const { writeContract } = useWriteContract();
  function purchaseCredits(listingId: number) {
    writeContract({
      abi: MARKETPLACE_ABI,
      address: MARKETPLACE_ADDRESS,
      functionName: "buyTokens",
      args: [listingId],
    });
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:scale-105 transform duration-300 ease-linear">
      {/* Status Badge */}
      <div className="relative bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-300" />
            <span className="text-white font-bold text-lg">
              Listing #{listingId}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-gray-500/20 text-gray-300"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Credits Amount */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 font-medium">
                Available Credits
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {credits.toString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">tCO₂e</p>
            </div>
            <div className="bg-emerald-800/20 p-3 rounded-lg">
              <Leaf className="w-8 h-8 text-emerald-300" />
            </div>
          </div>
        </div>

        {/* Price Information */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-300" />
            <p className="text-sm text-gray-300 font-medium">
              Price per Credit
            </p>
          </div>
          <p className="text-2xl font-bold text-emerald-300">
            {formattedPrice} ETH
          </p>
          <p className="text-sm text-gray-400 mt-1">Total: {totalPrice} ETH</p>
        </div>

        {/* Seller Information */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-300" />
            <p className="text-sm text-gray-300 font-medium">Seller</p>
          </div>
          <p className="text-xs font-mono text-gray-300 break-all">
            {seller.slice(0, 6)}...{seller.slice(-4)}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => purchaseCredits(listingId)}
          disabled={!isActive}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            isActive
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-700"
          }`}
        >
          {isActive ? "Purchase Credits" : "Not Available"}
        </button>
      </div>
    </div>
  );
}
