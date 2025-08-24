# Docker Setup for CodeGod Backend

This guide will help you set up and run the CodeGod backend application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Environment variables configured

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Application
PORT=8080
NODE_ENV=production

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8080

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/codegod

# PostgreSQL (for local development with docker-compose)
POSTGRES_DB=codegod
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=1d

# Judge0 API
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=your-judge0-api-key

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_URL=cloudinary://your-cloudinary-url

# Email (Mailtrap)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your-mailtrap-username
MAILTRAP_PASSWORD=your-mailtrap-password
MAILTRAP_SENDEREMAIL=noreply@codegod.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CLIENT_URL=http://localhost:5173

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

## Running with Docker Compose (Recommended)

1. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

## Running with Docker only

1. **Build the image:**
   ```bash
   docker build -t codegod-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:8080 --env-file .env codegod-backend
   ```

## Database Setup

The application uses PostgreSQL. When running with docker-compose, the database will be automatically set up. For production, you'll need to:

1. **Run database migrations:**
   ```bash
   docker-compose exec backend pnpm prisma migrate deploy
   ```

2. **Seed the database (if needed):**
   ```bash
   docker-compose exec backend pnpm prisma db seed
   ```

## Health Check

The application includes a health check endpoint at `/healthcheck`. You can test it with:

```bash
curl http://localhost:8080/healthcheck
```

## Production Deployment

For production deployment:

1. Use a proper PostgreSQL database (not the containerized one)
2. Set up proper environment variables
3. Use a reverse proxy (nginx) in front of the application
4. Set up SSL/TLS certificates
5. Configure proper logging and monitoring

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the port in docker-compose.yml or stop the service using port 8080

2. **Database connection issues:**
   - Ensure PostgreSQL is running and accessible
   - Check DATABASE_URL format

3. **Prisma client not generated:**
   - The Dockerfile automatically generates the Prisma client
   - If issues persist, run: `docker-compose exec backend pnpm prisma generate`

4. **Environment variables not loading:**
   - Ensure `.env` file exists and has correct format
   - Check for typos in variable names

### Logs

View application logs:
```bash
docker-compose logs -f backend
```

View database logs:
```bash
docker-compose logs -f postgres
```
