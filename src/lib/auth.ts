import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';

const mongoUri = process.env.MONGODB_URI;
const client = mongoUri ? new MongoClient(mongoUri) : undefined;
const db = client ? client.db('community-spark') : undefined;

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
const authSecret = process.env.BETTER_AUTH_SECRET || 'development-secret';

const socialProviders = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_SECRET
  ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      },
    }
  : undefined;

export const auth = betterAuth({
  baseURL,
  secret: authSecret,
  ...(db && client ? { database: mongodbAdapter(db, { client }) } : {}),
  ...(socialProviders ? { socialProviders } : {}),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  plugins: [jwt()],
});
