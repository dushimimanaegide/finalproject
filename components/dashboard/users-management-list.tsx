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
import { UserIcon, MoreHorizontalIcon } from "lucide-react"
import type { User } from "@prisma/client"

interface UsersManagementListProps {
  users: User[]
}

export function UsersManagementList({ users }: UsersManagementListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  if (users.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No users found.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Telephone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
              </TableCell>
              <TableCell>{user.telephone}</TableCell>
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

                        <DialogFooter>
                          <Button variant="outline">Edit User</Button>
                          <Button variant="destructive">Deactivate</Button>
                          <Button variant="destructive">Delete</Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
