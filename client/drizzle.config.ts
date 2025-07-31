import { defineConfig } from "drizzle-kit";

const databaseUrl = "postgresql://neondb_owner:npg_UL87dZDwVhka@ep-polished-haze-aexnzwuz-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL, ensure the database is provisioned");
// }
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl // Use environment variable or fallback to hardcoded URL
  },
});
