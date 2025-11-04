"use client";

import CustomConnectButton from "./customConnectButton";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const showSignInButton = pathname !== "/sign-in";
  
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
          {showSignInButton && (
            <SignInButton>
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold ">
                Sign In
              </button>
            </SignInButton>
          )}
        </SignedOut>
        <SignedIn>
          <UserButton />
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold "
          >
            Dashboard
          </Link>
        </SignedIn>
        <CustomConnectButton />
      </div>
    </header>
  );
}
