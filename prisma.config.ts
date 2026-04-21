import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        // 마이그레이션/introspection은 direct connection 사용 (Supabase 권장)
        // DIRECT_URL이 없으면 DATABASE_URL로 폴백
        url: process.env.DIRECT_URL ? env('DIRECT_URL') : env('DATABASE_URL'),
    },
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts',
    },
});
