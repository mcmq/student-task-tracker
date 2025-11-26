import type { IAuthRepository } from "@/lib/repositories/auth-repository.client"
import type { SignUpInput, SignInInput } from "@/lib/domain/user"
import { validateSignUp, validateSignIn } from "@/lib/domain/user"

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async signUp(input: SignUpInput, redirectUrl: string) {
    // Business validation
    validateSignUp(input)

    // Delegate to repository
    return await this.authRepository.signUp(input, redirectUrl)
  }

  async signIn(input: SignInInput, redirectUrl: string) {
    // Business validation
    validateSignIn(input)

    // Delegate to repository
    return await this.authRepository.signIn(input, redirectUrl)
  }

  async signOut() {
    return await this.authRepository.signOut()
  }

  async getCurrentUser() {
    return await this.authRepository.getCurrentUser()
  }
}
