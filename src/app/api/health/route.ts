import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "unknown",
    environment: {} as Record<string, boolean>,
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.status = "unhealthy";
    checks.database = "disconnected";
  }

  // Check required environment variables (never expose values!)
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "RESEND_API_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    checks.environment[envVar] = !!process.env[envVar];
  }

  // Determine overall health
  const allEnvVarsSet = Object.values(checks.environment).every(
    (v) => v === true,
  );
  if (!allEnvVarsSet || checks.database === "disconnected") {
    checks.status = "degraded";
  }

  const statusCode = checks.status === "healthy" ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
