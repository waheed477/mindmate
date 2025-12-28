# MindMate - Mental Healthcare Platform

## Overview

MindMate is a mental healthcare appointment booking platform that connects patients with mental health specialists. The application enables patients to browse doctors, book appointments, and manage their mental health journey, while doctors can manage their schedules and patient appointments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables (medical teal/calming blue palette)
- **Animations**: Framer Motion for page transitions and component animations
- **Forms**: React Hook Form with Zod validation

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- Path aliases configured: `@/` for client source, `@shared/` for shared code

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: Vite for client, esbuild for server bundling
- **API Style**: RESTful endpoints under `/api/` prefix

The server uses a modular structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route definitions
- `server/auth.ts` - Authentication with Passport.js (local strategy)
- `server/storage.ts` - Data access layer abstraction
- `server/db.ts` - Database connection setup
- `server/vite.ts` - Vite dev server integration
- `server/static.ts` - Production static file serving

### Authentication System
- Session-based authentication using `express-session`
- Passport.js with local strategy (username/password)
- Password hashing with scrypt
- Session storage in PostgreSQL via `connect-pg-simple`
- Role-based access control (patient vs doctor)

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with output to `./migrations`
- **Validation**: Drizzle-Zod for schema-to-validation conversion

Key entities:
- Users (base authentication)
- Patients (user profile extension)
- Doctors (user profile with specialization, fees, availability)
- Appointments (linking patients and doctors)
- Messages (communication between users)

### API Route Definitions
Routes are defined in `shared/routes.ts` with Zod schemas for type-safe request/response handling. The pattern includes:
- Path definitions
- HTTP methods
- Input schemas
- Response schemas per status code

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- Connection pooling via `pg` package

### Session Storage
- PostgreSQL-backed sessions via `connect-pg-simple`
- Creates session table automatically if missing

### External Services & APIs
- **DiceBear**: Avatar generation (`https://api.dicebear.com/7.x/avataaars/svg`)
- **Google Fonts**: Inter and Outfit font families

### Key NPM Dependencies
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `express` / `express-session`: Web server and sessions
- `passport` / `passport-local`: Authentication
- `@tanstack/react-query`: Client-side data fetching
- `@radix-ui/*`: Accessible UI primitives
- `zod`: Runtime validation
- `date-fns`: Date formatting
- `framer-motion`: Animations

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption (optional, has default)