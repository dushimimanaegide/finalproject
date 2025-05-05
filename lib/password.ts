import { randomBytes, scryptSync } from "crypto"

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  const [salt, storedHash] = storedPassword.split(":")
  const hash = scryptSync(suppliedPassword, salt, 64).toString("hex")
  return storedHash === hash
}
