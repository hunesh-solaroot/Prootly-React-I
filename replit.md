# replit.md

## Overview

This is a full-stack CRM web application designed for a renewable energy company. The application is built with a React.js frontend, Express.js backend, and uses PostgreSQL with Drizzle ORM for data management. The system provides comprehensive management capabilities for employees, clients, projects, and team collaboration with a modern, responsive interface featuring a green/yellow gradient theme inspired by renewable energy branding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with Radix UI components (shadcn/ui design system)
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite with custom configuration for development and production
- **UI Components**: Custom design system based on shadcn/ui with green/yellow gradient theme
- **Theme Support**: Light/dark mode toggle with system preference detection

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful JSON APIs with consistent error handling
- **Build Tool**: esbuild for production builds
- **Development**: tsx for TypeScript execution in development

### Project Structure
- `/client` - React frontend application with component-based architecture
- `/server` - Express backend with API routes and business logic
- `/shared` - Shared TypeScript schemas and types for type safety across stack
- `/migrations` - Database migration files managed by Drizzle

### Database Schema
The application uses five main entities with clear relationships:
- **Users**: Authentication and user management with username/password
- **Employees**: Staff management with roles, status tracking, and profile images
- **Clients**: Customer/company management with contact information and notes
- **Projects**: Project tracking with status categories (completed, hold, new, revision)
- **Comments**: Activity feed system with author attribution and timestamps

### HRM Profile System (Added August 2025)
Comprehensive employee profile management with:
- **Employee Profiles**: Full HRM-style profiles with personal/work information, skills, bio
- **Performance Grading**: Automated A/B/C/D grade system based on performance scores (0-100)
- **Attendance Tracking**: Daily attendance records with present/absent/late status tracking
- **Leave Management**: Leave request history with approval status and categorization
- **Document Storage**: Employee document management with upload/download capabilities
- **Performance Analytics**: Monthly performance trends and feedback tracking

### API Architecture
RESTful endpoints following standard conventions:
- Employee CRUD operations with search functionality
- Client management with company and contact person tracking
- Project statistics aggregation for dashboard metrics
- Comments system for activity tracking
- Consistent error handling and response formats

### UI/UX Design Patterns
- Sidebar navigation with collapsible sections and dropdown menus
- Card-based dashboard with project statistics and trend indicators
- Modal-based forms for data entry and editing
- Global search functionality across all entities
- Responsive grid/list view toggles for data presentation
- Toast notifications for user feedback
- **Enhanced Profile System**: Modern HRM-style profile interface with:
  - Animated performance score counters and progress bars
  - Interactive grade badges with tooltips (A/B/C/D grading system)
  - Tabbed interface for Overview, Attendance, Leave History, Documents, Performance
  - Profile image lightbox modal with click-to-expand functionality
  - Edit profile modal with form validation and image upload
  - Smooth fade-in animations and hover effects throughout
  - Dark/light theme support with consistent styling

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with migration management
- **Drizzle Kit**: CLI tools for schema management and migrations

### Frontend Libraries
- **React Query**: Server state management and caching
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-built component library with Tailwind styling
- **Wouter**: Lightweight routing library
- **date-fns**: Date manipulation and formatting
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR and development server
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer
- **ESBuild**: Fast JavaScript bundler for production builds