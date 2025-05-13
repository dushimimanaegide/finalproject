"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserIcon, MoreHorizontalIcon, PencilIcon, UserMinusIcon, Trash2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  updateUserAction,
  deactivateUserAction,
  activateUserAction,
  deleteUserAction,
} from "@/app/actions/user-actions"
import type { User } from "@prisma/client"

interface UsersManagementListProps {
  users: User[]
}

export function UsersManagementList({ users }: UsersManagementListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.telephone.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle user update
  async function handleUpdateUser(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await updateUserAction(formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        })
        setIsEditing(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user deactivation
  async function handleDeactivateUser() {
    if (!selectedUser) return

    setIsLoading(true)

    try {
      const result = await deactivateUserAction(selectedUser.id)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        })
        setIsDeactivating(false)
        // Update the local state to reflect the change
        setSelectedUser({ ...selectedUser, active: false })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user activation
  async function handleActivateUser() {
    if (!selectedUser) return

    setIsLoading(true)

    try {
      const result = await activateUserAction(selectedUser.id)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        })
        setIsActivating(false)
        // Update the local state to reflect the change
        setSelectedUser({ ...selectedUser, active: true })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user deletion
  async function handleDeleteUser() {
    if (!selectedUser) return

    setIsLoading(true)

    try {
      const result = await deleteUserAction(selectedUser.id)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      } else if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        })
        setIsDeleting(false)
        // Close the dialog
        setSelectedUser(null)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No users found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search users by name, email, or telephone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Telephone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No users match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={!user.active ? "opacity-60" : ""}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "outline" : "destructive"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedUser && (
                          <>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>View detailed information about this user</DialogDescription>
                            </DialogHeader>

                            {isEditing ? (
                              <form action={handleUpdateUser} className="py-4 space-y-4">
                                <input type="hidden" name="id" value={selectedUser.id} />

                                <div className="space-y-2">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    defaultValue={selectedUser.name}
                                    required
                                    disabled={isLoading}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={selectedUser.email}
                                    required
                                    disabled={isLoading}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="telephone">Telephone</Label>
                                  <Input
                                    id="telephone"
                                    name="telephone"
                                    defaultValue={selectedUser.telephone}
                                    required
                                    disabled={isLoading}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Role</Label>
                                  <RadioGroup defaultValue={selectedUser.role} name="role" className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="ADMIN" id="admin" disabled={isLoading} />
                                      <Label htmlFor="admin">Admin</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="CHW" id="chw" disabled={isLoading} />
                                      <Label htmlFor="chw">CHW</Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <DialogFooter className="mt-6">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            ) : (
                              <>
                                <div className="py-4 space-y-4">
                                  <div className="flex justify-center">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                      <UserIcon className="h-10 w-10 text-primary" />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Name:</div>
                                      <div className="text-sm col-span-2">{selectedUser.name}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Email:</div>
                                      <div className="text-sm col-span-2">{selectedUser.email}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Role:</div>
                                      <div className="text-sm col-span-2">
                                        <Badge variant={selectedUser.role === "ADMIN" ? "default" : "secondary"}>
                                          {selectedUser.role}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Status:</div>
                                      <div className="text-sm col-span-2">
                                        <Badge variant={selectedUser.active ? "outline" : "destructive"}>
                                          {selectedUser.active ? "Active" : "Inactive"}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Telephone:</div>
                                      <div className="text-sm col-span-2">{selectedUser.telephone}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Gender:</div>
                                      <div className="text-sm col-span-2">{selectedUser.gender}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-sm font-medium">Joined:</div>
                                      <div className="text-sm col-span-2">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <DialogFooter className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit User
                                  </Button>
                                  {selectedUser.active ? (
                                    <Button
                                      variant="secondary"
                                      onClick={() => setIsDeactivating(true)}
                                      className="flex items-center gap-1"
                                    >
                                      <UserMinusIcon className="h-4 w-4" />
                                      Deactivate
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      onClick={() => setIsActivating(true)}
                                      className="flex items-center gap-1"
                                    >
                                      <UserIcon className="h-4 w-4" />
                                      Activate
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    onClick={() => setIsDeleting(true)}
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2Icon className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Deactivate User Confirmation */}
                    <AlertDialog open={isDeactivating} onOpenChange={setIsDeactivating}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to deactivate this user? They will no longer be able to log in to the
                            system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeactivateUser}
                            disabled={isLoading}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            {isLoading ? "Deactivating..." : "Deactivate"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Activate User Confirmation */}
                    <AlertDialog open={isActivating} onOpenChange={setIsActivating}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Activate User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to activate this user? They will be able to log in to the system
                            again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleActivateUser} disabled={isLoading}>
                            {isLoading ? "Activating..." : "Activate"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete User Confirmation */}
                    <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone and will permanently
                            remove the user and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={isLoading}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isLoading ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
