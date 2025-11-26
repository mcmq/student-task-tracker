"use client"

import type { SignUpInput, SignInInput, User } from "@/lib/domain/user"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export interface IAuthRepository {
  signUp(input: SignUpInput, redirectUrl: string): Promise<{ error: Error | null }>
  signIn(input: SignInInput, redirectUrl: string): Promise<{ error: Error | null }>
  signOut(): Promise<{ error: Error | null }>
  getCurrentUser(): Promise<User | null>
}

// Supabase implementation (Adapter)
class SupabaseAuthRepository implements IAuthRepository {
  constructor(private supabase: SupabaseClient) {}

  async signUp(input: SignUpInput, redirectUrl: string) {
    const { error } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: input.full_name,
        },
      },
    })

    return { error: error ? new Error(error.message) : null }
  }

  async signIn(input: SignInInput, redirectUrl: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
      // options: {
      //   emailRedirectTo: redirectUrl,
      // },
    })

    return { error: error ? new Error(error.message) : null }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    return { error: error ? new Error(error.message) : null }
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name,
    }
  }
}

export async function createAuthRepositoryAsync(): Promise<IAuthRepository> {
  const supabase = await createServerClient()
  return new SupabaseAuthRepository(supabase)
}
