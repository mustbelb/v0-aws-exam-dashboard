import { SignupForm } from "./signup-form";
import { AuthShell } from "@/components/auth-shell";
import Link from "next/link";
export default function SignupPage() {
  return (
    <AuthShell
      title="Make space to learn."
      description="Create your account and start exploring your certification path."
    >
      <SignupForm />
      <p className="text-sm text-muted-foreground mt-7">
        Already have an account?{" "}
        <Link className="text-primary font-medium" href="/auth/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
