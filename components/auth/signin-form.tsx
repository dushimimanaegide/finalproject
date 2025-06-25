"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInAction } from "../../app/actions/auth-actions"
import { Input } from "../ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function SignInForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signInAction(formData)

      if ("error" in result) {
        setError(result.error ?? "Unknown error")
        setIsLoading(false)
        return
      }

      toast({ title: "Login successful" })

      // Redirect based on role
      if (result.user?.role === "ADMIN") {
        router.push("/dashboard/admin")
      } else {
        router.push("/dashboard/chw")
      }

      router.refresh()
    } catch (error: any) {
      console.error("Unexpected login error:", error)
      setError(error?.message ?? "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
