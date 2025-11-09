"use client";

import { ListingCard } from "@/app/components/listingcard";
import { useReadContract } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "../../constants";
import { Leaf, Search } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Carbon Credit Marketplace
          </h1>
          <p className="text-gray-300 text-lg">
            Discover and purchase verified carbon credits from global projects
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
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
