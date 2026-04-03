import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        if (!user.emailVerified) return null

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      // Fetch fresh isAdmin status
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isAdmin: true, displayName: true, points: true, level: true },
        })
        if (dbUser) {
          token.isAdmin = dbUser.isAdmin
          token.displayName = dbUser.displayName
          token.points = dbUser.points
          token.level = dbUser.level
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.displayName = token.displayName as string | null
        session.user.points = token.points as number
        session.user.level = token.level as number
      }
      return session
    },
  },
})
