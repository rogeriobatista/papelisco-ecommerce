#!/bin/sh

# Docker entrypoint script for development
set -e

echo "🔧 Starting Papelisco E-commerce development environment..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until npx prisma db push --accept-data-loss > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping for 2 seconds"
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client if not already generated
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# Check if database needs seeding
echo "🌱 Checking if database needs seeding..."
if npx prisma db seed > /dev/null 2>&1; then
  echo "✅ Database seeded successfully!"
else
  echo "ℹ️  Database seeding skipped (may already be seeded)"
fi

echo "🚀 Starting Next.js development server..."

# Start the application
exec "$@"