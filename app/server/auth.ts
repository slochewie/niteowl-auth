import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { Pool } from "pg";
const trustedOrigins=(process.env.BETTER_AUTH_TRUSTED_ORIGINS??"").split(",").map(v=>v.trim()).filter(Boolean);
export const auth=betterAuth({appName:"NiteOwl Auth",baseURL:process.env.BETTER_AUTH_URL,secret:process.env.BETTER_AUTH_SECRET,trustedOrigins,database:new Pool({connectionString:process.env.DATABASE_URL}),emailAndPassword:{enabled:true},plugins:[organization({allowUserToCreateOrganization:true})]});
