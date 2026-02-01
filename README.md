# EcommerceAI

Full-stack e-commerce platform with multi-role support (admin, seller, customer).

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Express, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State**: Zustand, TanStack Query

## Setup

1. **Install dependencies**
```bash
bun install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

3. **Setup database**
```bash
bun run db:push
bun run db:seed
```

4. **Run development server**
```bash
bun run dev
```

Visit `http://localhost:5000`

## Default Users

- **Admin**: `admin` / `admin123`
- **Seller**: `seller1` / `seller123`
- **Customer**: `customer1` / `customer123`

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Run production build
- `bun run db:push` - Push schema to database
- `bun run db:seed` - Seed dummy data