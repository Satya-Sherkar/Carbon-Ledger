"use client";

import CustomConnectButton from "./customConnectButton";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const showGetStartedButton =
    pathname !== "/sign-in" && pathname !== "/sign-up"; 
  const showDashboardButton = pathname !== "/dashboard";
  const showConnectWalletButton = pathname !== "/";

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-transparent shadow-sm  h-16">
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="block bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            <Link href="/">Carbon-Ledger</Link>
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <SignedOut>
          {showGetStartedButton && (
            <SignInButton>
              <button className="px-4 py-2 text-white font-semibold border-2 cursor-pointer hover:bg-white/10">
                Get Started
              </button>
            </SignInButton>
          )}
        </SignedOut>
        <SignedIn>
          <UserButton />
          {showDashboardButton && (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-white font-semibold border-2 cursor-pointer hover:bg-white/10 rounded-md"
            >
              Dashboard
            </Link>
          )}
        </SignedIn>

        {showConnectWalletButton && <CustomConnectButton />}
      </div>
    </header>
  );
}
