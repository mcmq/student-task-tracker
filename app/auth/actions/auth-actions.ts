import { createAuthRepositoryAsync } from "@/lib/repositories/auth-repository.server"
import { AuthService } from "@/lib/services/auth-service"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signOutAction() {
  const authRepo = await createAuthRepositoryAsync()
  const authService = new AuthService(authRepo)

  const { error } = await authService.signOut()

  if (!error) {
    revalidatePath("/")
    redirect("/")
  }

  return { error }
}
