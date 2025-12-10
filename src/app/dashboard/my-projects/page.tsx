"use client";

import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { ProjectCard } from "@/components/projectCard";

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
        <div>
            <h1>My Projects</h1>
            {loading && <p>Loading projects...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && projects.length === 0 && (
                <p>No projects found.</p>
            )}
            {!loading && !error && Array.isArray(projects) && projects.map((project: any) => (
                <ProjectCard key={project.projectId} {...project} />
            ))}
        </div>
    );
}