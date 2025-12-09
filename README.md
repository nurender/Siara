# Siara Events - Event Management System

A modern event management system built with Next.js, Node.js, and MySQL.

## Features

- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- 🔐 JWT Authentication
- 📝 CMS for Content Management
- 📊 Dashboard Analytics
- 🎯 Event Management
- 📧 Contact Form
- 📸 Media Library

## Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MySQL
- **Process Manager:** PM2
- **Authentication:** JWT

## Quick Start

### Prerequisites
- Node.js 18+ (via NVM)
- MySQL 8.0+
- PM2

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nurender/Siara.git siara-events
cd siara-events
```

2. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
```

3. Setup environment:
```bash
cp .env.example .env
# Edit .env with your configuration
cp .env backend/.env
```

4. Setup database:
```bash
cd backend
node database/setup.js
node database/setup-cms.js
node database/seed-cms.js
cd ..
```

5. Build and start:
```bash
npm run build
pm2 start ecosystem.config.js
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for complete deployment guide.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
siara-events/
├── src/              # Frontend source code
├── backend/          # Backend API
├── public/           # Static assets
├── ecosystem.config.js  # PM2 configuration
└── DEPLOY.md         # Deployment guide
```

## License

MIT

## Repository

https://github.com/nurender/Siara
