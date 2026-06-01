const { execSync } = require("child_process");
const hasPostgresUrl = Boolean(process.env.POSTGRES_PRISMA_URL);
const isVercel = Boolean(process.env.VERCEL);
const usePostgres = isVercel || hasPostgresUrl;
const localSchema = "prisma/schema.prisma";
const postgresSchema = "prisma/schema.postgres.prisma";
const schema = usePostgres ? postgresSchema : localSchema;
const commands = [
  `npx prisma generate --schema ${schema}`,
  `npx prisma migrate deploy --schema ${schema}`,
];
for (const command of commands) {
  execSync(command, { stdio: "inherit" });
}