export type User = {
  id: string
  email: string
  full_name?: string
}

export type SignUpInput = {
  email: string
  password: string
  full_name: string
}

export type SignInInput = {
  email: string
  password: string
}

// Business validation rules
export function validateSignUp(input: SignUpInput): void {
  if (!input.email || !input.email.includes("@")) {
    throw new Error("Invalid email address")
  }
  if (!input.password || input.password.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }
  if (!input.full_name || input.full_name.trim().length === 0) {
    throw new Error("Full name is required")
  }
}

export function validateSignIn(input: SignInInput): void {
  if (!input.email || !input.email.includes("@")) {
    throw new Error("Invalid email address")
  }
  if (!input.password) {
    throw new Error("Password is required")
  }
}
