# SellUrOldBook

Production-ready full-stack marketplace for buying and selling second-hand books with OTP-based authentication and role-based dashboards.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React (Vite), React Router, Axios, Context API
- Auth/Security: Email OTP, bcrypt password hashing, JWT authorization

## Roles Supported

- User (Buyer)
- Bookseller (Seller)
- Admin

## Features

### Authentication

- OTP request for signup and login
- OTP verification for account creation and login completion
- Email-based OTP via nodemailer
- Password hashing with bcrypt
- JWT session handling

### User

- Browse books from all booksellers
- Search and filter by name, publication, price range
- Add books to cart
- Update cart quantities and remove items
- Place orders with delivery address
- View order history

### Bookseller

- Add books with name, publication, condition, price, seller address, seller email
- Upload optional book image
- Update and delete own books
- View listed books
- View received orders

### Admin

- OTP-secured login/signup (optional admin signup key)
- View all users
- View all booksellers
- View all books
- View all bookings with buyer, seller and book details

## Project Structure

```text
SellUrOldBook/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      utils/
      app.js
      server.js
    uploads/
    .env.example
  frontend/
    src/
      api/
      components/
      context/
      pages/
      App.jsx
      main.jsx
      index.css
    .env.example
```

## Backend Setup

1. Go to backend:

```bash
cd backend
```

2. Copy environment file and set values:

```bash
cp .env.example .env
```

3. Required backend `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_email_app_password
FRONTEND_URL=http://localhost:5173
ADMIN_SIGNUP_KEY=optional_admin_signup_secret
```

4. Install and run:

```bash
npm install
npm run dev
```

## Frontend Setup

1. Go to frontend:

```bash
cd frontend
```

2. Copy environment file and set values:

```bash
cp .env.example .env
```

3. Required frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_ROOT=http://localhost:5000
```

4. Install and run:

```bash
npm install
npm run dev
```

## API Overview

### Auth

- `POST /api/auth/request-otp`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Books

- `GET /api/books`
- `GET /api/books/seller/mine`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

### Cart

- `GET /api/cart`
- `POST /api/cart/add`
- `PATCH /api/cart/item/:bookId`
- `DELETE /api/cart/item/:bookId`
- `POST /api/cart/checkout`

### Orders

- `GET /api/orders/my`
- `GET /api/orders/seller`

### Admin

- `GET /api/admin/overview`
- `GET /api/admin/users`
- `GET /api/admin/booksellers`
- `GET /api/admin/books`
- `GET /api/admin/bookings`

## Deployment Notes

### Backend (Render/Railway)

- Deploy `backend` as a Node service
- Set all backend environment variables
- Ensure `MONGODB_URI` points to MongoDB Atlas

### Frontend (Vercel/Netlify)

- Deploy `frontend` as a static site
- Set `VITE_API_URL` and `VITE_API_ROOT` to your backend URL

## Security Notes

- Keep `.env` out of source control
- Use strong `JWT_SECRET`
- Restrict `ADMIN_SIGNUP_KEY` for trusted admin onboarding
- In production, replace local upload strategy with cloud storage (S3/Cloudinary)

## Validation Performed

- Backend module load check passed (`src/app`)
- Frontend production build passed (`npm run build`)
