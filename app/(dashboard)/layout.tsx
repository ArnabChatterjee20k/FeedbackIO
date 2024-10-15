import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleIcon, Home, LogOut } from "lucide-react";
import { getUser } from "@/lib/server/utils";
import Logo from "@/components/logo";

async function Header() {
  const user = await getUser()

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {/* <CircleIcon className="h-6 w-6 text-orange-500" /> */}
          <Logo/>
          <span className="ml-2 text-xl font-semibold text-gray-900">FeedbackSO</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <Button className="bg-primary">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
