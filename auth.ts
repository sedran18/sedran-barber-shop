import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs" 

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" }, // Obrigatório para usar Credentials
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 1. Busca o barbeiro no banco
        const barber = await prisma.barber.findUnique({
          where: { email: String(credentials.email)}
        })

        if (!barber || !barber.password) return null

        // 2. Compara a senha (usando bcrypt para segurança)
        const isValid = await bcrypt.compare(
          String(credentials.password),
          barber.password
        )

        if (!isValid) return null

        // 3. Retorna os dados que você quer no Token
        return {
          id: barber.id,
          name: barber.name,
          email: barber.email,
          role: barber.role, // Aqui passamos o Role
        }
      },
    }),
  ],
  callbacks: {
    // Injeta o Role no JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    // Injeta o Role na Sessão para o front-end ler
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "EMPLOYEE"
        session.user.id= token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login", // Redireciona para sua página customizada
  }
})