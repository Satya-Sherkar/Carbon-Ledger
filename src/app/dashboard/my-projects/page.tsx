"use client";

import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { ProjectCard } from "@/components/projectCard";
import { Leaf, FolderOpen, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MyProjects() {
    const { address } = useAccount();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getProjects = useCallback(async function () {
        if (!address) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/get-projects?ownerWalletAddress=" + address, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const data = await response.json();
            // Handle different response structures
            if (Array.isArray(data)) {
                setProjects(data);
            } else if (data && Array.isArray(data.projects)) {
                setProjects(data.projects);
            } else {
                console.error("Unexpected API response format:", data);
                setProjects([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        getProjects();
    }, [getProjects, address]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 py-12">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-8 h-8 text-emerald-300" />
                                <h1 className="text-3xl font-bold text-white">
                                    My Projects
                                </h1>
                            </div>
                            <p className="text-gray-300 text-sm sm:text-base">
                                Manage and monitor your registered carbon credit projects
                            </p>
                        </div>
                        <Link
                            href="/dashboard/register-project"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Register New Project
                        </Link>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white/5 rounded-xl border border-white/10 h-96"
                            >
                                <div className="bg-emerald-900/40 h-16 rounded-t-xl"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/10 rounded w-full"></div>
                                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                    <div className="h-24 bg-white/10 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-8 rounded-xl bg-red-900/20 backdrop-blur-sm border border-red-500/30">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                            <h3 className="text-lg font-semibold text-red-300">
                                Error Loading Projects
                            </h3>
                        </div>
                        <p className="text-red-200 ml-9">{error}</p>
                        <button
                            onClick={() => getProjects()}
                            className="mt-4 ml-9 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && !address && (
                    <div className="text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                        <Leaf className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-300 font-medium text-lg">
                            Connect Your Wallet
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Please connect your wallet to view your projects
                        </p>
                    </div>
                )}

                {!loading && !error && address && projects.length === 0 && (
                    <div className="text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                        <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-300 font-medium text-lg">
                            No Projects Yet
                        </p>
                        <p className="text-gray-400 text-sm mt-2 mb-6">
                            Get started by registering your first carbon credit project
                        </p>
                        <Link
                            href="/dashboard/register-project"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Register Your First Project
                        </Link>
                    </div>
                )}

                {/* Projects Grid */}
                {!loading && !error && projects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project: any) => (
                            <ProjectCard key={project.projectId} {...project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}