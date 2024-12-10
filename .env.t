# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.

# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
DATABASE_URL="postgresql://postgres:FFVX3z_Lw6IAetKn@localhost:6543/programmify"
# DATABASE_URL="postgresql://postgres.edqacqlpvhblvyxkhzuc:K10kf4mmwscCuF8M@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
# DIRECT_URL="postgresql://postgres.edqacqlpvhblvyxkhzuc:K10kf4mmwscCuF8M@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"


# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https:    //next-auth.js.org/configuration/options#secret
NEXTAUTH_SECRET="mwD633uFryNIFyBChuuFXfs870zUgUYg226IY+g5FCg="
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000/api/auth"

# Next Auth Discord Provider
DISCORD_CLIENT_ID="1241401497502093435"
DISCORD_CLIENT_SECRET="8BCNDdQRsPpZ5SWznFBs_H0o_lnNDJ9v"

NEXT_PUBLIC_SUPABASE_URL="https://edqacqlpvhblvyxkhzuc.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcWFjcWxwdmhibHZ5eGtoenVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODk5NDU4MiwiZXhwIjoyMDM0NTcwNTgyfQ.w_e688puNK10WxpehV6l8SVqzyYGvGDBlJzeCpDeKCM"

# Supabase
SUPABASE_URL="https://edqacqlpvhblvyxkhzuc.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-from-supabase"
NEXT_PUBLIC_SUPABASE_URL="https://edqacqlpvhblvyxkhzuc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcWFjcWxwdmhibHZ5eGtoenVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODk5NDU4MiwiZXhwIjoyMDM0NTcwNTgyfQ.w_e688puNK10WxpehV6l8SVqzyYGvGDBlJzeCpDeKCM"
SUPABASE_JWT_SECRET="M9XNZzUvIhIKmwQfJY+KHE8HL0kkwAxTDrZOYl0/GG2lKkLUKcz05CoyPDSEHcXFqHrotqLXDGJCljDqijdlSg=="