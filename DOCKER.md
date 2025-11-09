# Docker Infrastructure for Papelisco E-commerce

This document provides comprehensive instructions for running the Papelisco e-commerce application using Docker in both development and production environments.

## 📋 Prerequisites

- Docker Engine 20.10.0+
- Docker Compose 2.0.0+
- At least 4GB RAM available for Docker
- Ports 3000, 5432, 6379, 5050, 8081 available (development)
- Ports 80, 443 available (production)

## 🏗️ Architecture Overview

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   PostgreSQL    │    │     Redis       │
│   (Port 3000)  │◄──►│   (Port 5432)   │    │   (Port 6379)   │
│  Hot Reload     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    pgAdmin      │    │ Redis Commander │    │   Your Browser  │
│   (Port 5050)   │    │   (Port 8081)   │    │   localhost:3000│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Next.js App   │    │   PostgreSQL    │
│  (Ports 80/443) │◄──►│      x2         │◄──►│                 │
│  Load Balancer  │    │   (Port 3000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲                       ▲
                                │                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Redis       │    │   DB Backups    │
                       │   (Port 6379)   │    │   (Daily)       │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Development Environment

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd papelisco-ecommerce
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start all services:**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. **Access the application:**
   - **Main App**: http://localhost:3000
   - **pgAdmin**: http://localhost:5050 (admin@papelisco.com / admin)
   - **Redis Commander**: http://localhost:8081

### Development Commands

#### Start Services
```bash
# Start all services in background
docker compose -f docker-compose.dev.yml up -d

# Start with logs visible
docker compose -f docker-compose.dev.yml up

# Start specific service
docker compose -f docker-compose.dev.yml up -d postgres
```

#### Stop Services
```bash
# Stop all services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (clean slate)
docker compose -f docker-compose.dev.yml down -v
```

#### View Logs
```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f app
docker compose -f docker-compose.dev.yml logs -f postgres
docker compose -f docker-compose.dev.yml logs -f redis
```

#### Execute Commands in Containers
```bash
# Shell access to app container
docker compose -f docker-compose.dev.yml exec app sh

# PostgreSQL command line
docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d papelisco_dev

# Redis command line
docker compose -f docker-compose.dev.yml exec redis redis-cli
```

#### Rebuild Containers
```bash
# Rebuild all images
docker compose -f docker-compose.dev.yml build

# Rebuild specific service
docker compose -f docker-compose.dev.yml build app

# Rebuild and restart
docker compose -f docker-compose.dev.yml up -d --build
```

#### Check Status
```bash
# View running containers
docker compose -f docker-compose.dev.yml ps

# View resource usage
docker stats
```

### Development Database Access

#### Using pgAdmin (Web Interface)
1. Open http://localhost:5050
2. Login: `admin@papelisco.com` / `admin`
3. Add new server:
   - **Name**: Papelisco Dev
   - **Host**: postgres
   - **Port**: 5432
   - **Username**: postgres
   - **Password**: postgres
   - **Database**: papelisco_dev

#### Using Command Line
```bash
# Connect to database
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d papelisco_dev

# Run SQL file
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d papelisco_dev < backup.sql

# Create backup
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres -d papelisco_dev > backup.sql
```

### Hot Reload

The development setup includes hot reload support:
- **Source code changes**: Automatically reflected in the browser
- **Package.json changes**: Requires container restart
- **Environment changes**: Requires container restart

## 🏭 Production Environment

### Prerequisites

1. **Create production environment file:**
   ```bash
   cp .env.production .env.prod
   # Edit .env.prod with production values
   ```

2. **Update critical security values:**
   - `POSTGRES_PASSWORD`
   - `REDIS_PASSWORD`
   - `APP_SECRET`
   - `JWT_SECRET`

### Production Commands

#### Deploy Application
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View deployment status
docker-compose -f docker-compose.prod.yml ps
```

#### Scale Application
```bash
# Scale app to 3 instances
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --scale app=3

# Scale down to 1 instance
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --scale app=1
```

#### Production Maintenance
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update and redeploy
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

#### Database Backups
```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres -d papelisco_prod > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d papelisco_prod < backup_file.sql
```

#### Security Updates
```bash
# Pull latest base images
docker-compose -f docker-compose.prod.yml pull

# Rebuild with updated dependencies
docker-compose -f docker-compose.prod.yml build --no-cache --pull

# Deploy updates
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 🔧 Configuration

### Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NODE_ENV` | development | production | Node.js environment |
| `DATABASE_URL` | postgres://... | postgres://... | PostgreSQL connection string |
| `REDIS_URL` | redis://... | redis://... | Redis connection string |
| `NEXT_PUBLIC_API_URL` | http://localhost:3000 | https://api.domain.com | Public API URL |
| `APP_SECRET` | dev-secret | STRONG_SECRET | Application secret key |
| `JWT_SECRET` | dev-jwt | STRONG_JWT_SECRET | JWT signing secret |

### Port Mapping

#### Development
- **3000**: Next.js application
- **5432**: PostgreSQL database
- **6379**: Redis cache
- **5050**: pgAdmin web interface
- **8081**: Redis Commander

#### Production
- **80**: HTTP (Nginx)
- **443**: HTTPS (Nginx)
- **3000**: Next.js (internal)
- **5432**: PostgreSQL (internal)
- **6379**: Redis (internal)

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill process using port
kill -9 <PID>
```

#### Permission Denied
```bash
# Fix Docker socket permissions (Linux/WSL)
sudo chmod 666 /var/run/docker.sock

# Or add user to docker group
sudo usermod -aG docker $USER
```

#### Out of Disk Space
```bash
# Clean up Docker system
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.dev.yml restart postgres
```

#### Application Won't Start
```bash
# Check application logs
docker-compose -f docker-compose.dev.yml logs app

# Rebuild application
docker-compose -f docker-compose.dev.yml build app

# Clear Next.js cache
docker-compose -f docker-compose.dev.yml exec app rm -rf .next
```

### Health Checks

#### Development
```bash
# Check application health
curl http://localhost:3000

# Check database connection
docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U postgres

# Check Redis connection
docker-compose -f docker-compose.dev.yml exec redis redis-cli ping
```

#### Production
```bash
# Check application health
curl http://localhost/health

# Check all services
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Monitoring

### Container Resources
```bash
# View resource usage
docker stats

# View specific container
docker stats papelisco-app-dev
```

### Logs Management
```bash
# Follow logs with timestamps
docker-compose -f docker-compose.dev.yml logs -f -t

# Limit log output
docker-compose -f docker-compose.dev.yml logs --tail=100

# Save logs to file
docker-compose -f docker-compose.dev.yml logs > app.log
```

## 🔐 Security Best Practices

### Development
- Use strong passwords even in development
- Don't commit sensitive data to git
- Regularly update dependencies

### Production
- **Never use default passwords**
- **Use environment variables for secrets**
- **Enable SSL/TLS with valid certificates**
- **Regularly backup databases**
- **Monitor for security updates**
- **Use Docker secrets for sensitive data**
- **Implement proper firewall rules**
- **Regular security audits**

## 📈 Performance Optimization

### Development
- Use volume mounts for fast file changes
- Allocate sufficient RAM to Docker
- Use .dockerignore to reduce build context

### Production
- Multi-stage builds for smaller images
- Enable gzip compression in Nginx
- Use Redis for caching
- Scale horizontally with multiple app instances
- Monitor resource usage and optimize

## 🆘 Getting Help

If you encounter issues:

1. **Check logs**: Always start by checking container logs
2. **Verify environment**: Ensure all environment variables are set
3. **Check documentation**: Review this document for common solutions
4. **Clean slate**: Try stopping all containers and starting fresh
5. **Resource constraints**: Ensure sufficient system resources

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment/docker)
- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [Redis Docker Documentation](https://hub.docker.com/_/redis)
- [Nginx Docker Documentation](https://hub.docker.com/_/nginx)