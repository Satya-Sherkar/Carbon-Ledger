import { Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const date = new Date().getFullYear();
    return (
      <footer>
        <div className="flex justify-center bg-transparent p-4">
          <p>&copy; {date} Carbon Marketplace. All rights reserved.</p>
          <div className="flex gap-6 ml-8">
            <Link
              href="https://twitter.com"
              className="text-gray-600 hover:text-emerald-500"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://github.com/Satya-Sherkar/Carbon-Ledger"
              className="text-gray-600 hover:text-emerald-500"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-gray-600 hover:text-emerald-500"
            >
              <Linkedin size={20} />
            </Link>
          </div>
          <div className="flex gap-6 ml-8">
            <Link
              href="/docs"
              className="text-gray-600 hover:text-emerald-500 text-sm"
            >
              Docs
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-emerald-500 text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-emerald-500 text-sm"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    );
}