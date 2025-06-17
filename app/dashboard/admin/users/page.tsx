import { CreateUserForm } from "@/components/auth/signup-form";

export default function UsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-1">Manage administrators and Community Health Workers</p>
        </div>
        <CreateUserForm />
      </div>
    </div>
  )
}
