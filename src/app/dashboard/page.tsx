"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Leaf,
  Plus,
  Store,
  TrendingUp,
  BarChart3,
  BanknoteArrowUp,
} from "lucide-react";
import { ListingCard } from "@/components/listingcard";
import { useReadContract } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/constants";

type DbStatus = "checking" | "ok" | "error";

export default function UserDashboard() {
  const { user, isLoaded, isSignedIn } = useUser(); // use isLoaded/isSignedIn too
  const [dbStatus, setDbStatus] = useState<DbStatus>("checking");
  const [dbError, setDbError] = useState<string | null>(null);

  const {
    data: listings,
    isLoading,
    error,
  } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAllListings",
  }) as { data: any[] | undefined; isLoading: boolean; error: Error | null };

  // Check / create user in MongoDB once Clerk user is ready
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const clerkId = user.id;

    const syncUser = async () => {
      try {
        setDbStatus("checking");

        const res = await fetch("/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, clerkId }),
        });

        if (res.status === 201 || res.status === 409) {
          // 201 = created; 409 = already exists
          setDbStatus("ok");
          setDbError(null);
        } else {
          const data = await res.json().catch(() => null);
          setDbStatus("error");
          setDbError(data?.error || "Failed to sync user with database.");
        }
      } catch (err) {
        console.error(err);
        setDbStatus("error");
        setDbError("Unexpected error while contacting the server.");
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  // Handle loading states before main UI
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading your session...</p>
      </div>
    );
  }

  if (dbStatus === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Preparing your dashboard...</p>
      </div>
    );
  }

  if (dbStatus === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
        <p className="text-red-400 font-semibold mb-2">
          There was a problem setting up your account.
        </p>
        <p className="text-gray-300 text-sm mb-4">
          {dbError ?? "Please try again in a moment."}
        </p>
        <p className="text-gray-400 text-xs">
          If this keeps happening, contact support.
        </p>
      </div>
    );
  }

  // Normal dashboard UI once DB user is confirmed
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header (card) */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-gray-300 mt-1">
                Manage your carbon credits and explore the marketplace
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/register-project"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Register Project
              </Link>
              <Link
                href="/dashboard/list-credits"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
              >
                <BanknoteArrowUp className="w-5 h-5" />
                Sell Your Credits
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Active Listings
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {listings ? listings.length : "0"}
                </p>
              </div>
              <div className="bg-emerald-800/20 p-3 rounded-lg">
                <Store className="w-8 h-8 text-emerald-300" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Carbon Impact
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  <span className="text-2xl">-</span> tCO₂
                </p>
              </div>
              <div className="bg-blue-800/20 p-3 rounded-lg">
                <Leaf className="w-8 h-8 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Market Activity
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  <TrendingUp className="w-6 h-6 inline text-green-300" />
                  <span className="text-xl ml-2">Active</span>
                </p>
              </div>
              <div className="bg-purple-800/20 p-3 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Section (card) */}
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Active Listings</h2>
              <p className="text-gray-300 mt-1">
                Browse available carbon credits
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 text-emerald-300 hover:bg-emerald-800/10 font-medium rounded-lg transition-colors border border-emerald-600/20"
            >
              View All
              <Store className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/3 rounded-lg h-64"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 font-medium">Error loading listings</p>
              <p className="text-gray-400 text-sm mt-2">
                Please check your wallet connection
              </p>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any, index: number) => (
                <ListingCard key={index} listing={listing} listingId={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 font-medium">No listings available</p>
              <p className="text-gray-400 text-sm mt-2">
                Be the first to register a project
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
