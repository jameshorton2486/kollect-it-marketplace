// Minimal Prisma config to replace deprecated package.json#prisma usage
// Docs: https://pris.ly/prisma-config
const config = {
  schema: 'prisma/schema.prisma',
  // Keep seeding command consistent with existing workflow
  seed: 'bun run prisma/seed.ts',
};

export default config;
