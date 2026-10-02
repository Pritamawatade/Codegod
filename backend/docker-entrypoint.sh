#!/bin/sh
set -e
if [ "${SKIP_PRISMA_MIGRATE:-}" = "true" ]; then
  echo "SKIP_PRISMA_MIGRATE=true — skipping prisma migrate deploy"
else
  echo "Applying Prisma migrations..."
  pnpm prisma migrate deploy
fi
exec pnpm start
