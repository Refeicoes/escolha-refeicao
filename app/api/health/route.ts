import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const envPresence = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    ADMIN_USERNAME: Boolean(process.env.ADMIN_USERNAME),
    ADMIN_PASSWORD_HASH: Boolean(process.env.ADMIN_PASSWORD_HASH),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
  };

  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    return Response.json({ envPresence, db: "ok", result });
  } catch (err) {
    const error = err instanceof Error ? { name: err.name, message: err.message } : String(err);
    return Response.json({ envPresence, db: "error", error }, { status: 500 });
  }
}
