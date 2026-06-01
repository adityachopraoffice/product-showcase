const { execSync } = require("child_process");
const hasPostgresUrl = Boolean(process.env.POSTGRES_PRISMA_URL);
const isVercel = Boolean(process.env.VERCEL);
const usePostgres = isVercel || hasPostgresUrl;
const localSchema = "prisma/schema.prisma";
const postgresSchema = "prisma/schema.postgres.prisma";
const schema = usePostgres ? postgresSchema : localSchema;

// Only generate client during build, skip migrate
execSync(`npx prisma generate --schema ${schema}`, { stdio: "inherit" });

// Only run migrate if not in Vercel build environment
if (!process.env.VERCEL) {
  execSync(`npx prisma migrate deploy --schema ${schema}`, { stdio: "inherit" });
}