# Papelisco E-commerce

A modern, full-stack e-commerce platform built with cutting-edge technologies. Features a complete shopping experience with product catalog, cart management, user authentication, and comprehensive testing suite.

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd papelisco-ecommerce
   cp .env.example .env.local
   ```

2. **Start the development environment:**
   ```bash
   docker compose up -d
   ```

3. **Initialize the database:**
   ```bash
   docker compose exec app npx prisma migrate dev
   docker compose exec app npx prisma db seed
   ```

4. **Access the application:**
   - **App**: http://localhost:3000
   - **Database Admin**: http://localhost:5050 (admin@papelisco.com / admin)
   - **Redis Commander**: http://localhost:8081

5. **Stop the environment:**
   ```bash
   docker compose down
   ```

### Manual Setup

1. **Prerequisites:**
   - Node.js 18+ 
   - PostgreSQL 15+
   - Redis (optional but recommended)

2. **Installation:**
   ```bash
   git clone <repository-url>
   cd papelisco-ecommerce
   npm install
   cp .env.example .env.local
   ```

3. **Database setup:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router (React 19)
- **Language**: TypeScript 5
- **State Management**: Redux Toolkit with React-Redux
- **Styling**: SASS/SCSS Modules + Tailwind CSS
- **Authentication**: JWT + NextAuth.js

### Backend
- **API**: Next.js API Routes (RESTful)
- **Database**: PostgreSQL 15 with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT tokens + session management
- **Password Security**: bcryptjs

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (production)
- **Environment Management**: Multi-environment support (.env files)
- **Database Admin**: pgAdmin 4

### Testing & Quality
- **Testing Framework**: Jest + React Testing Library
- **Test Environment**: jsdom
- **Coverage**: Istanbul (nyc)
- **Linting**: ESLint with Next.js config
- **Type Safety**: Full TypeScript coverage

## 🛍️ Features

### E-commerce Core
- ✅ **Product Catalog**: Browse products with filtering and search
- ✅ **Shopping Cart**: Add, remove, and manage cart items
- ✅ **Product Details**: Detailed product pages with images and descriptions
- ✅ **User Authentication**: Login, register, and profile management
- ✅ **User Profiles**: Personal information and preference management
- ✅ **Wishlist**: Save favorite products for later
- ✅ **Order Management**: Track and manage orders

### Technical Features
- ✅ **Responsive Design**: Mobile-first, adaptive UI
- ✅ **State Management**: Centralized Redux store
- ✅ **API Integration**: RESTful API with proper error handling
- ✅ **Database Integration**: PostgreSQL with Prisma ORM
- ✅ **Authentication**: JWT-based auth with session management
- ✅ **Caching**: Redis for improved performance
- ✅ **Testing**: Comprehensive unit test suite (80+ tests)
- ✅ **Docker Support**: Complete containerized development environment
- ✅ **TypeScript**: Full type safety across the application

## 🔧 Available Commands

### Development Commands
```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint linter
```

### Testing Commands
```bash
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Database Commands
```bash
npx prisma migrate dev   # Run database migrations
npx prisma db seed       # Seed database with sample data
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma generate      # Generate Prisma client
```

### Docker Commands

#### Development Environment
```bash
docker compose up -d                    # Start all services
docker compose down                     # Stop all services
docker compose logs -f                  # View logs
docker compose exec app sh              # Shell access to app container
docker compose exec postgres psql -U postgres -d papelisco_dev  # Database access
```

#### Production Environment
```bash
docker compose -f docker-compose.prod.yml up -d     # Start production
docker compose -f docker-compose.prod.yml down      # Stop production
```

#### With Development Tools
```bash
docker compose --profile tools up -d               # Include pgAdmin & Redis Commander
```

## 🌐 Environment Configuration

### Development URLs
- **Application**: http://localhost:3000
- **pgAdmin**: http://localhost:5050 (admin@papelisco.com / admin)
- **Redis Commander**: http://localhost:8081
- **Prisma Studio**: http://localhost:5555

### Production URLs
- **Application**: http://localhost (via Nginx reverse proxy)

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/papelisco_dev

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Application URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
APP_SECRET=your-app-secret
JWT_SECRET=your-jwt-secret

# Development
NEXT_TELEMETRY_DISABLED=1
```

## 📁 Project Structure

```
papelisco-ecommerce/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product management
│   │   │   ├── orders/        # Order management
│   │   │   └── wishlist/      # Wishlist functionality
│   │   ├── (pages)/           # Application pages
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout process
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── product/       # Product details
│   │   │   └── profile/       # User profile
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # App providers (Redux, etc.)
│   ├── components/            # Reusable React components
│   │   ├── ui/               # UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── features/             # Redux slices
│   │   ├── auth/             # Authentication state
│   │   ├── cart/             # Shopping cart state
│   │   ├── products/         # Product state
│   │   └── store.ts          # Redux store configuration
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── prisma.ts         # Database client
│   │   └── utils.ts          # General utilities
│   ├── styles/               # SASS/SCSS styles
│   └── utils/                # Helper functions
├── __tests__/                # Test files
│   ├── api/                  # API route tests
│   ├── components/           # Component tests
│   └── lib/                  # Library tests
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts              # Database seeding script
├── database/                 # Database initialization
├── nginx/                    # Nginx configuration
├── docker-compose.*.yml      # Docker Compose configurations
├── Dockerfile*               # Docker images
└── package.json             # Dependencies and scripts
```

## 🗄️ Database Schema

### Core Models
- **User**: User accounts with authentication
- **Product**: Product catalog with categories and images
- **Category**: Product categorization
- **Cart**: Shopping cart items
- **Order**: Order management
- **Session**: User session management
- **Wishlist**: User's saved products

### Key Relationships
- Users have many orders, cart items, and wishlist items
- Products belong to categories and have many images
- Orders contain multiple order items
- Cart items link users to products

## 🧪 Testing

### Test Coverage
- **API Routes**: Authentication, products, orders, profile management
- **Components**: UI components with user interaction testing
- **Utilities**: Authentication helpers, storage utilities
- **Integration**: End-to-end workflow testing

### Test Structure
```bash
__tests__/
├── api/
│   ├── auth/
│   │   ├── login.test.ts         # Login API tests
│   │   ├── register.test.ts      # Registration tests
│   │   └── profile.test.ts       # Profile management tests
│   └── products.test.ts          # Product API tests
├── components/
│   └── InternalHeader.test.tsx   # Component tests
└── lib/
    ├── auth.test.ts             # Auth utility tests
    └── authStorage.test.ts      # Storage utility tests
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test __tests__/api/auth/login.test.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Production
```bash
# Build and start production containers
docker compose -f docker-compose.prod.yml up -d

# The app will be available at http://localhost
```

### Environment Setup
1. Configure production environment variables
2. Set up PostgreSQL database
3. Configure Redis (optional but recommended)
4. Set up SSL certificates for HTTPS
5. Configure domain and DNS

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/[id]` - Get product details

### Cart & Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured CORS policies
- **Environment Variables**: Sensitive data protection
- **SQL Injection Prevention**: Prisma ORM protection

## ⚡ Performance Optimizations

- **Next.js App Router**: Optimized routing and rendering
- **Redis Caching**: Session and data caching
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting with Next.js
- **TypeScript**: Compile-time error detection

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes and add tests**
4. **Run the test suite**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Use conventional commit messages
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📖 Additional Resources

- **[Docker Guide](DOCKER.md)** - Comprehensive Docker setup and usage
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework docs
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM docs
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management docs

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database connection issues**
   ```bash
   # Reset database containers
   docker compose down -v
   docker compose up -d
   ```

3. **Node modules issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Prisma issues**
   ```bash
   # Reset Prisma
   npx prisma generate
   npx prisma migrate reset
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❓ Support

- **Documentation**: Check [DOCKER.md](DOCKER.md) for Docker-specific issues
- **Issues**: Open a GitHub issue for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and community support
