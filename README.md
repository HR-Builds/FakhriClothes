# Fakhri Clothes

**A Modern Pakistani Unstitched Fashion Store**

Fakhri Clothes is a full-stack e-commerce website built to bring a refined online shopping experience to Pakistani fashion customers. The platform showcases unstitched clothing collections through an elegant storefront, with product browsing, shopping cart, checkout, order management, and an administrative dashboard.

🌐 **Live Website:** [fakhriclothes.online](https://fakhriclothes.online)

---

## ✨ Overview

Fakhri Clothes combines a premium fashion aesthetic with practical e-commerce functionality. The website is designed around a clean, elegant interface, featuring emerald green, gold, cream, and maroon tones.

The goal is simple: make discovering and ordering unstitched clothing online convenient, accessible, and enjoyable.

## 🛍️ Store Features

- **Premium Storefront** — A polished homepage designed to showcase collections and featured products.
- **Product Catalog** — Browse clothing products with product details, pricing, and images.
- **Clothing Categories** — Explore:
  - Unstitched Shirts
  - Unstitched 2-Piece
  - Unstitched 3-Piece
- **Product Images** — Upload and serve product images through dedicated API routes.
- **Shopping Cart** — Review selected products before checkout.
- **Customer Accounts** — Account and registration functionality.
- **Checkout Experience** — Collect customer and delivery information to place orders.
- **Order Management** — Support order workflows through the application.
- **Email Notifications** — Customer and order-related email communication.
- **Admin Dashboard** — Manage products and relevant store content.
- **Responsive Interface** — Designed for a convenient experience across desktop and mobile screens.

## 💳 Checkout & Payments

The project includes a payment-provider integration structure, with Safepay configuration for online payment processing.

Payment behavior depends on the configured environment and valid provider credentials. Sandbox and live transactions must be configured and tested separately before accepting real payments.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack web application |
| React | Interactive user interface |
| TypeScript | Type-safe application code |
| Tailwind CSS | Styling and responsive layouts |
| Prisma | Database access and ORM |
| SQLite | Local database configuration |
| Node.js | JavaScript runtime |
| Safepay | Payment integration |
| Git & GitHub | Version control and source management |
| cPanel | Website hosting and deployment |

## 🎨 Design Philosophy

The visual identity of Fakhri Clothes is inspired by understated luxury and traditional Pakistani fashion.

- **Emerald Green** — Sophistication and identity
- **Gold** — A premium finishing touch
- **Cream** — Clean, comfortable visual space
- **Maroon** — Depth and richness
- **Elegant Typography** — A balance of contemporary design and classic fashion presentation

## 🚀 Run Locally

### Prerequisites

- Node.js compatible with the project
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/HR-Builds/FakhriClothes.git
cd FakhriClothes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file using the variables required by the application.

Configure your database, authentication, email service, and payment provider according to the project's environment setup.

**Never commit `.env` files, API keys, passwords, payment secrets, or customer data to GitHub.**

### 4. Set up the database

Run the database commands required by the project's Prisma schema and configured database provider.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create a production build

```bash
npm run build
```

Start the production server using the project's configured deployment setup.

## 📁 Project Structure

```text
fakhri-clothes/
├── public/
│   └── uploads/
├── prisma/
├── src/
│   └── app/
│       ├── api/
│       │   ├── admin/
│       │   ├── payments/
│       │   └── uploads/
│       ├── admin/
│       ├── category/
│       └── ...
├── package.json
├── next.config.*
├── tsconfig.json
└── README.md
```

*The structure above is a high-level overview; individual files may vary.*

## 🔐 Security & Reliability

- Keep credentials and environment variables private.
- Validate customer input on the server.
- Protect administrative functionality with appropriate authentication and authorization.
- Verify payment status through trusted server-side provider callbacks.
- Back up the database before performing production changes.
- Test checkout, email delivery, product uploads, and payment callbacks before releasing updates.

## 🌐 Deployment

The project is maintained in GitHub and deployed to a custom domain:

- **Repository:** [HR-Builds/FakhriClothes](https://github.com/HR-Builds/FakhriClothes)
- **Production Domain:** [fakhriclothes.online](https://fakhriclothes.online)
- **Hosting:** cPanel with a Node.js application environment

## 🔮 Future Improvements

- Expanded product discovery and filtering
- Enhanced inventory and order reporting
- Additional customer account features
- Improved performance and accessibility
- Further checkout and payment-flow testing
- Expanded analytics for store management

## 👨‍💻 Developer

**Hassan Rashid**


