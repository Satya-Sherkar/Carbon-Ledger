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
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="py-2 text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-green-400 to-blue-500">
              Carbon-Ledger Marketplace
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400 md:mx-0">
              Discover curated, verified carbon credits — buy, sell, and support
              real-world emissions reductions.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap md:justify-end">
            <div className="flex justify-end sm:justify-start">
              <div className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <Leaf className="h-5 w-5 text-emerald-400" />
                <div className="text-right">
                  <div className="text-xs text-gray-400">Listed Credits</div>
                  <div className="text-sm font-semibold text-white">
                    {listedCredits ?? (
                      <span className="text-gray-400">Loading...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end sm:justify-start">
              <div className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <Leaf className="h-5 w-5 text-emerald-400" />
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
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-24 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-2">
                <button className="text-gray-400 transition-colors hover:text-emerald-400">
                  <Filter className="h-5 w-5" />
                </button>
                <button className="text-gray-400 transition-colors hover:text-emerald-400">
                  <ArrowUpDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/register-project"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
              >
                <Plus className="h-5 w-5" />
                Register Your Project
              </Link>
              <Link
                href="/dashboard/list-credits"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
              >
                <BanknoteArrowUp className="h-5 w-5" />
                Sell Your Credits
              </Link>
            </div>
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
