import { Twitter, Github, Linkedin, UserCog, UserStar } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const date = new Date().getFullYear();

  return (
    <footer>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com"
              className="text-gray-600 transition hover:text-emerald-500"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://github.com/Satya-Sherkar/Carbon-Ledger"
              className="text-gray-600 transition hover:text-emerald-500"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/satyam-sherkar"
              className="text-gray-600 transition hover:text-emerald-500"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="/admin"
              className="text-white font-semibold cursor-pointer hover:text-emerald-500"
            >
              <UserCog size={20} />
            </Link>
            <Link
              href="/auditor"
              className="text-white font-semibold cursor-pointer hover:text-emerald-500"
            >
              <UserStar size={20} />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
            <Link href="/docs" className="transition hover:text-emerald-500">
              Docs
            </Link>
            <Link href="/privacy" className="transition hover:text-emerald-500">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-emerald-500">
              Terms
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600 hover:text-emerald-500">
          &copy; {date} Carbon Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
