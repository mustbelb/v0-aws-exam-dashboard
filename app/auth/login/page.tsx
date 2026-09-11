import { LoginForm } from "./login-form";
import { AuthShell } from "@/components/auth-shell";
import Link from "next/link";
export default function LoginPage() {
  return (
    <AuthShell
      title="Pick up where you left off."
      description="Sign in to return to your study workspace."
    >
      <LoginForm />
      <p className="text-sm text-muted-foreground mt-7">
        New here?{" "}
        <Link className="text-primary font-medium" href="/auth/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
