import { SignUpForm } from "@/components/auth/signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up to access the Rwanda Health Information Enhancement platform
          </p>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
