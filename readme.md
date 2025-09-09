# replit.md

## Overview

This is a full-stack CRM web application designed for a renewable energy company. The application is built with a React.js frontend, Express.js backend, and uses PostgreSQL with Drizzle ORM for data management. The application provides modules for managing employees, clients, projects, and comments with a modern dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with Radix UI components (shadcn/ui)
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom configuration
- **UI Components**: Custom design system based on shadcn/ui with green/yellow gradient theme

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful JSON APIs
- **Build Tool**: esbuild for production builds
- **Development**: tsx for TypeScript execution

### Project Structure
- `/client` - React frontend application
- `/server` - Express backend with API routes
- `/shared` - Shared TypeScript schemas and types
- `/migrations` - Database migration files

## Key Components

### Database Schema
The application uses five main entities:
- **Users**: Authentication and user management
- **Employees**: Staff management with roles and status
- **Clients**: Customer/company management with contact information
- **Projects**: Project tracking with status (completed, hold, new, revision)
- **Comments**: Activity feed with author and timestamp information

### API Endpoints
- `GET/POST /api/employees` - Employee CRUD operations
- `GET /api/employees/search` - Employee search functionality
- `GET/POST /api/clients` - Client CRUD operations
- `GET /api/clients/search` - Client search functionality
- `GET /api/projects/stats` - Dashboard project statistics
- `GET/POST /api/comments` - Comments feed management

### Frontend Pages
- **Dashboard**: Project statistics, latest offers banner, recent comments
- **Employees**: Employee management with grid/list views, search, and CRUD operations
- **Clients**: Client management with similar functionality to employees
- **Design, Teams, Garage, Members, Settings**: Placeholder pages for future features

### Storage Layer
The application implements an in-memory storage interface (`IStorage`) with plans for database integration. The storage layer supports:
- User authentication and management
- Employee and client CRUD operations
- Project status tracking
- Comment system for activity feeds
- Search functionality across entities

## Data Flow

1. **Client Requests**: React components use TanStack React Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validate data using Zod schemas
3. **Storage Layer**: Currently uses in-memory storage, designed for easy database integration
4. **Response**: JSON responses sent back to React components
5. **UI Updates**: React Query automatically updates UI when data changes

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database operations
- **Connection**: Uses `DATABASE_URL` environment variable

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Modern icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code formatting and linting

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR
- Backend: tsx with automatic TypeScript compilation
- Database: Drizzle migrations with `db:push` command

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server to `dist/index.js`
- Single deployment artifact with static file serving

### Environment Setup
- `NODE_ENV`: Controls development vs production behavior
- `DATABASE_URL`: Required for database connection
- Replit-specific plugins for development environment integration

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a focus on developer experience with hot reloading and automated tooling.