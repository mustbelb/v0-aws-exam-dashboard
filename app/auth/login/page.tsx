// app/auth/login/page.tsx
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              AWS
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue your AWS certification journey
          </p>
        </div>
        
        <LoginForm />
        
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
