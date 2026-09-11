"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers3, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function Header({
  user,
  preview = false,
}: {
  user?: { id: string; email: string; name: string };
  preview?: boolean;
}) {
  const router = useRouter();
  async function signOut() {
    const { error } = await createClient().auth.signOut();
    if (!error) {
      router.push("/");
      router.refresh();
    }
  }
  return (
    <header className="border-b bg-card">
      <div className="max-w-[1340px] mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
        <Link
          href={preview ? "/design-preview" : user ? "/dashboard" : "/"}
          className="flex items-center gap-3"
        >
          <span className="brand-mark">
            <Layers3 size={23} />
          </span>
          <span className="font-semibold tracking-tight text-lg">
            AWS Exam Prep
            <span className="hidden sm:block text-[11px] uppercase tracking-[.18em] text-muted-foreground font-medium">
              Your cloud study space
            </span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden md:flex h-full items-center gap-8 text-sm"
        >
          <Link
            className="h-full flex items-center border-b-2 border-primary font-medium"
            href={preview ? "/design-preview" : "/dashboard"}
          >
            Study workspace
          </Link>
          <span className="text-muted-foreground">
            Associate certifications
          </span>
        </nav>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-full p-1"
              aria-label="Account menu"
            >
              <span className="rounded-full bg-secondary text-primary w-9 h-9 grid place-items-center text-sm font-semibold">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden sm:block text-sm">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(preview ? "/design-preview" : "/dashboard")
                }
              >
                <LayoutDashboard size={15} className="mr-2" />
                Workspace
              </DropdownMenuItem>
              {!preview && (
                <DropdownMenuItem onClick={signOut}>
                  <LogOut size={15} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link className="text-sm font-medium" href="/auth/login">
            Sign in <span aria-hidden>↗</span>
          </Link>
        )}
      </div>
    </header>
  );
}
