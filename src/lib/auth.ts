import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Staff Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'staff@appalachiannutrition.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        // Auto-bootstrap initial owner account if User table is completely empty
        const userCount = await prisma.user.count();
        if (userCount === 0) {
          const initEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@appalachiannutrition.com').toLowerCase();
          const initPass = process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMe2026!';
          const hash = await bcrypt.hash(initPass, 10);
          await prisma.user.create({
            data: {
              name: 'Shop Owner',
              email: initEmail,
              passwordHash: hash,
              role: 'OWNER',
            },
          });
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
