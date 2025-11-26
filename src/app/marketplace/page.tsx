"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listingcard";
import { useReadContract, useBalance } from "wagmi";
import {
  MARKETPLACE_ABI,
  MARKETPLACE_ADDRESS,
  CARBON_CREDIT_TOKEN_ADDRESS,
  CARBON_CREDIT_TOKEN_ABI,
} from "@/constants";
import {
  Leaf,
  Search,
  Plus,
  BanknoteArrowUp,
  ArrowUpDown,
  Filter,
} from "lucide-react";

export default function Marketplace() {
  const {
    data: listings,
    isLoading,
    error,
  } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAllListings",
  }) as { data: any[] | undefined; isLoading: boolean; error: Error | null };

  // Get the current balance of listed carbon credits in the marketplace contract
  const { data: balanceData } = useBalance({
    address: MARKETPLACE_ADDRESS,
    token: CARBON_CREDIT_TOKEN_ADDRESS,
  }) as {
    data?: { formatted: string };
    isLoading: boolean;
    error: Error | null;
  };

  const listedCredits = balanceData?.formatted;

  // The total supply of the carbon credit token
  const { data: totalSupply }: { data?: bigint } = useReadContract({
    address: CARBON_CREDIT_TOKEN_ADDRESS,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: "totalSupply",
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="py-2 text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-green-400 to-blue-500">
              Carbon-Ledger Marketplace
            </h1>
            <p className="mt-2 text-sm text-gray-400 max-w-2xl">
              Discover curated, verified carbon credits — buy, sell, and support
              real-world emissions reductions.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <div className="text-xs text-gray-400">Listed Credits</div>
                <div className="text-sm font-semibold text-white">
                  {listedCredits ?? (
                    <span className="text-gray-400">Loading...</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <div className="text-xs text-gray-400">Total Supply</div>
                <div className="text-sm font-semibold text-white">
                  {totalSupply ?? (
                    <span className="text-gray-400">Loading...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <ArrowUpDown className="w-5 h-5" />
                </button>
              </div>
            </div>
            <Link
              href="/dashboard/register-project"
              className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Register Your Project
            </Link>
            <Link
              href="/dashboard/list-credits"
              className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <BanknoteArrowUp className="w-5 h-5" />
              Sell Your Credits
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/5 rounded-lg h-64"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white/5 rounded-lg backdrop-blur-sm">
              <p className="text-red-400 font-medium">
                Error loading marketplace listings
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please check your wallet connection and try again
              </p>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any, index: number) => (
                <ListingCard key={index} listing={listing} listingId={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-lg backdrop-blur-sm">
              <Leaf className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 font-medium">No listings available</p>
              <p className="text-gray-400 text-sm mt-2">
                Check back later for new carbon credit listings
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
