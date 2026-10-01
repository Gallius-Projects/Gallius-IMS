import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const getPrismaInstance = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  try {
    const dbUrl = new URL(connectionString);
    const adapter = new PrismaMariaDb({
      host: dbUrl.hostname || 'localhost',
      port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
      user: dbUrl.username || 'root',
      password: decodeURIComponent(dbUrl.password || ''),
      database: dbUrl.pathname.substring(1) || 'inventory_db',
      connectionLimit: process.env.NODE_ENV === 'production' ? 10 : 5,
    });

    return new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to initialize Prisma database adapter:', error);
    // Return standard client if URL parsing fails as a fallback (though it will likely error in Prisma 7)
    return new PrismaClient();
  }
};

if (process.env.NODE_ENV === 'production') {
  prisma = getPrismaInstance();
} else {
  if (!global.prisma) {
    global.prisma = getPrismaInstance();
  }
  prisma = global.prisma;
}

export { prisma };
export default prisma;
