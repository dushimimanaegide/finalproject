import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"

export default async function Home() {
 const session = await getSession()
  const dashboardPath = session?.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/chw"
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">RHIE</h1>
          <div className="space-x-4">
            {session ? (
              <Link href={dashboardPath}>
                <Button variant="secondary">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="text-white border-white hover:text-primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Rwanda Health Information Enhancement</h2>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Strengthening the capacity of health workers in Rwanda by improving the accessibility, accuracy, and
              utilization of health information systems.
            </p>
            {!session && (
              <Link href="/auth/signup">
                <Button size="lg" className="font-semibold">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Real-Time Data Collection</h3>
                <p>
                  Collect and share health information immediately using digital tools, helping identify health problems
                  faster.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Improved Communication</h3>
                <p>
                  Use mobile tools to easily contact health centers and report emergencies, reducing delays and
                  improving coordination.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Better Decision-Making</h3>
                <p>
                  With better data, health officials can plan services and resources more accurately and track diseases
                  in time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Rwanda Health Information Enhancement. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
