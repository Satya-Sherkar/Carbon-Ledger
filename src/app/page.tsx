"use client";

import { features } from "./constants";
import Link from "next/link";
import { ShieldUser } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Content container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="block bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Carbon-Ledger
                  </span>
                </h1>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-300">
                  Blockchain Powered
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Trade Carbon
                <span className="block bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Credits
                </span>
                <span className="block">On-Chain</span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                The decentralized marketplace for verified carbon credits.
                Offset your emissions with blockchain transparency and real-time
                trading.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace">
                <button className="px-8 py-4 rounded-lg bg-linear-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 transform duration-300 ease-linear">
                  Explore Marketplace
                </button>
              </Link>
              <Link href="/dashboard/register-project">
                <button className="px-8 py-4 rounded-lg bg-linear-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 transform duration-300 ease-linear">
                  Register Your Project
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">2.5M+</div>
                <div className="text-sm text-gray-400">Credits Traded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm text-gray-400">Active Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">$45M</div>
                <div className="text-sm text-gray-400">Total Volume</div>
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Why Choose Our Platform
              </h2>
              <p className="text-gray-400">
                Built on cutting-edge blockchain technology to ensure
                transparency, security, and efficiency in carbon credit trading.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 transform"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Blockchain badge */}
            <div className="p-6 rounded-xl bg-linear-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-green-500 flex items-center justify-center text-2xl">
                  ⛓️
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Powered by Ethereum
                  </h3>
                  <p className="text-sm text-gray-400">
                    All transactions are secured on the Ethereum blockchain with
                    smart contract automation and full auditability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
