"use client"

import { useState } from "react"
import Link from "next/link"
import { signInAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function SignInForm() {
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    try{
      setIsLoading(true)
      setError(null)
  
      const result = await signInAction(formData)
  
      if (result.success) {
        if(result.user?.role === "ADMIN"){  
          route.push("/dashboard/admin")
        }else{
          route.push("/dashboard/chw")
        }
        toast({
          title: "Login successful",
        })
        route.refresh()
    }
    }catch(error){
      setIsLoading(false)
    }
  }


  return (
    <form action={handleSubmit} className="space-y-6">
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required disabled={isLoading} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </form>
  )
}
