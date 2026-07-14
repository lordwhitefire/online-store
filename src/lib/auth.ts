import { auth, currentUser } from "@clerk/nextjs"

export async function getAuthUser() {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  return user
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  const isAdmin = user.publicMetadata?.role === "admin"
  if (!isAdmin) {
    throw new Error("Admin access required")
  }
  return user
}
