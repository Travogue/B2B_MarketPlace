# B2B Marketplace Portal

A production-ready B2B e-commerce marketplace similar to IndiaMART, built with the MERN stack.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Redux Toolkit, React Router, MUI, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcrypt, Role-based Access Control |
| Storage | Cloudinary (images), Multer (uploads) |
| Email | Nodemailer (SMTP) |

## User Roles

- **Super Admin** — Platform management, approvals, CMS, analytics
- **Seller/Supplier** — Product catalog, inquiries, quotations, subscriptions
- **Buyer/Customer** — RFQ, wishlist, chat, inquiry management

## Project Structure

```
E-Commerce/
├── backend/                 # Express API (MVC)
│   └── src/
│       ├── config/          # DB, Cloudinary
│       ├── controllers/     # Route handlers
│       ├── middleware/      # Auth, validation, upload, errors
│       ├── models/          # Mongoose schemas (14 collections)
│       ├── routes/          # REST API routes
│       ├── utils/           # Helpers, seed script
│       └── validators/      # express-validator rules
├── frontend/                # React SPA
│   └── src/
│       ├── components/      # Layout, common UI
│       ├── pages/           # Public, auth, buyer, seller, admin
│       ├── routes/          # App routing, protected routes
│       ├── services/        # Axios API layer
│       ├── store/           # Redux Toolkit slices
│       └── theme/           # MUI theme
├── shared/                  # Shared constants
├── README.md
└── DEPLOYMENT.md
```

## Database Collections

Users, Companies, Products, Categories, Subcategories, Inquiries, Quotations, Reviews, Notifications, Banners, SubscriptionPlans, Orders, Chats, CMSPages

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)
- Cloudinary account (optional for image uploads)
- SMTP credentials (optional for emails)

### 1. Clone & Install

```bash
cd E-Commerce
npm run install:all
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary & SMTP credentials
npm run seed    # Seed admin user, categories, CMS pages, subscription plans
npm run dev     # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm run dev     # Starts on http://localhost:5173
```

### Default Admin Credentials

```
Email: admin@b2bmarketplace.com
Password: Admin@123456
```

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Companies | `/api/companies` |
| Products | `/api/products` |
| Categories | `/api/categories` |
| Inquiries | `/api/inquiries` |
| Quotations | `/api/quotations` |
| Reviews | `/api/reviews` |
| Notifications | `/api/notifications` |
| Banners | `/api/banners` |
| Subscriptions | `/api/subscriptions` |
| Orders | `/api/orders` |
| Chats | `/api/chats` |
| CMS | `/api/cms` |
| Search | `/api/search` |

## Features Implemented

### Public
- Homepage with hero, categories, trending products, suppliers, reviews
- Product listing with filters, sorting, pagination
- Product details with RFQ, wishlist
- Supplier listing & profiles with verification badges
- Global search, CMS pages, contact form

### Buyer Dashboard
- Dashboard, inquiries, wishlist, profile, notifications, chat

### Seller Dashboard
- Dashboard, product CRUD, company profile, inquiries, quotations
- Subscription plans, analytics with charts

### Admin Dashboard
- User management, seller/product approval, categories, CMS, banners
- Subscription plans, inquiry monitoring, reports & analytics

## License

ISC
