import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_CLIENT_ID || '',
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET || '',
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // Return the existing token if it's not expired
      // (MSAL handles token refresh behind the scenes)
      return token;
    },

    async session({ session, token }) {
      // Add access token to session for API calls
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      return session;
    },
  },
});
