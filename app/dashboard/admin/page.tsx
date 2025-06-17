import { requireAdmin } from "@/lib/auth"
import { UsersManagementList } from "@/components/dashboard/users-management-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { CreateUserForm } from "@/components/auth/signup-form"

export default async function AdminUsersPage() {
  await requireAdmin()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  const adminCount = users.filter((user) => user.role === "ADMIN").length
  const chwCount = users.filter((user) => user.role === "CHW").length
  const activeCount = users.filter((user) => user.active).length
  const inactiveCount = users.filter((user) => !user.active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground mt-1">Manage administrators and Community Health Workers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adminCount}</div>
            <p className="text-sm text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Community Health Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{chwCount}</div>
            <p className="text-sm text-muted-foreground">Field health workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCount}</div>
            <p className="text-sm text-muted-foreground">Users with system access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inactiveCount}</div>
            <p className="text-sm text-muted-foreground">Deactivated accounts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
          </div>
          <CreateUserForm />
        </CardHeader>
        <CardContent>
          <UsersManagementList users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
