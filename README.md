# Papelisco E-commerce

A modern e-commerce application built with Next.js, TypeScript, Redux, and SASS.

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Start the development environment:**
   ```bash
   docker compose up -d
   ```

2. **Access the application:**
   - **App**: http://localhost:3000
   - **Database Admin**: http://localhost:5050 (admin@papelisco.com / admin)

3. **Stop the environment:**
   ```bash
   docker compose down
   ```

### Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- **[Docker Guide](DOCKER.md)** - Comprehensive Docker setup and usage
- **[Development Guide](#)** - Coming soon
- **[Deployment Guide](#)** - Coming soon

## 🏗️ Architecture

- **Frontend**: Next.js 16 with App Router
- **State Management**: Redux Toolkit
- **Styling**: SASS Modules
- **Database**: PostgreSQL
- **Cache**: Redis
- **Deployment**: Docker

## 🛍️ Features

- ✅ Product catalog with filtering and search
- ✅ Shopping cart functionality
- ✅ Product detail pages
- ✅ Responsive design
- ✅ Redux state management
- ✅ Docker development environment
- ✅ Database integration ready

## 🔧 Available Commands

### Docker Commands

```bash
# Development environment
docker compose up -d                    # Start all services
docker compose down                     # Stop all services
docker compose logs -f                  # View logs
docker compose exec app sh              # Shell access

# Production environment
docker compose -f docker-compose.prod.yml up -d

# With tools (pgAdmin, Redis Commander)
docker compose --profile tools up -d
```

### NPM Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 Environment URLs

### Development
- **App**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
- **Redis Commander**: http://localhost:8081

### Production
- **App**: http://localhost (via Nginx)

## 📁 Project Structure

```
papelisco-ecommerce/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── features/           # Redux slices
│   └── styles/             # SASS modules
├── database/
│   └── init/               # Database initialization
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Development compose
├── docker-compose.dev.yml  # Development (explicit)
├── docker-compose.prod.yml # Production compose
├── Dockerfile              # Production image
├── Dockerfile.dev          # Development image
└── DOCKER.md              # Docker documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ❓ Support

For detailed Docker usage, see [DOCKER.md](DOCKER.md).

For other questions, please open an issue.
