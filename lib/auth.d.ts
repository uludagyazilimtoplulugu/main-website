import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      isAdmin: boolean
      displayName: string | null
      points: number
      level: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isAdmin: boolean
    displayName: string | null
    points: number
    level: number
  }
}
