"use client"

import { useState } from "react"
import Link from "next/link"
import { signUpAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function SignUpForm() {
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signUpAction(formData)

    try{
      if (result.success) {
       if(result.user?.role === "ADMIN"){
        route.push("/dashboard/admin")
       }else{
        route.push("/dashboard/chw")
       }
      }

    }catch(error:any){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      })
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">Telephone</Label>
          <Input id="telephone" name="telephone" placeholder="+250 7XX XXX XXX" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup defaultValue="male" name="gender" className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  )
}
