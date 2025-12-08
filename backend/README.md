# Siara Events - Backend API

Node.js + Express + MySQL backend for Siara Events

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=siara_events
```

### 3. Setup Database
Run the SQL schema in MySQL:
```bash
mysql -u root -p < database/schema.sql
```

Or manually run `database/schema.sql` in phpMyAdmin/MySQL Workbench

### 4. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile (Auth) |
| PUT | `/api/auth/password` | Update password (Auth) |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Submit contact form |
| GET | `/api/contacts` | Get all contacts (Admin) |
| GET | `/api/contacts/:id` | Get single contact (Admin) |
| PUT | `/api/contacts/:id` | Update contact (Admin) |
| DELETE | `/api/contacts/:id` | Delete contact (Admin) |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events (Auth) |
| GET | `/api/events/upcoming` | Get upcoming events (Auth) |
| GET | `/api/events/:id` | Get single event (Auth) |
| POST | `/api/events` | Create event (Admin) |
| PUT | `/api/events/:id` | Update event (Admin) |
| DELETE | `/api/events/:id` | Delete event (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get all bookings (Admin) |
| GET | `/api/bookings/:id` | Get single booking (Admin) |
| PUT | `/api/bookings/:id` | Update booking (Admin) |
| DELETE | `/api/bookings/:id` | Delete booking (Admin) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get statistics (Admin) |
| GET | `/api/dashboard/activities` | Get recent activities (Admin) |

## Default Admin Login
```
Email: admin@siara.com
Password: admin123
```

## Tech Stack
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs

