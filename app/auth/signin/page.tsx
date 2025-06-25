import { getCurrentUser } from "../../actions/auth-actions"
import { SignInForm } from "@/components/auth/signin-form"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const user = await getCurrentUser()
  if(user){
   redirect("/")
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to access your account</p>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-sm">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
