# E-commerce Micro-Frontend Application

This is a micro-frontend e-commerce application built using Module Federation. The application consists of multiple independent applications that work together to create a seamless shopping experience.

## Architecture Overview

The application consists of the following micro-frontends and services:

- **Host** (`port: 3000`): Main application that orchestrates all other micro-frontends
- **Product Detail** (`port: 3001`): Product details and information
- **Shopping Cart** (`port: 3002`): Shopping cart functionality
- **Auth** (`port: 3003`): User authentication and authorization
- **Search** (`port: 3004`): Product search functionality
- **Orders** (`port: 3005`): Order management
- **Server** (`port: 5000`): Backend API service

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for the backend server)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/guneyural/microfrontend-ecommerce-app.git
cd microfrontend-ecommerce-app
```

2. Install dependencies for each service:

```bash
# Install dependencies for each micro-frontend
cd host && npm install
cd ../product-detail-page && npm install
cd ../shopping-cart && npm install
cd ../auth && npm install
cd ../search && npm install
cd ../orders && npm install
cd ../server && npm install
```

## Running the Application

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start each micro-frontend (open new terminal for each):

```bash
# Host application
cd host
npm start

# Product Detail
cd product-detail-page
npm start

# Shopping Cart
cd shopping-cart
npm start

# Auth
cd auth
npm start

# Search
cd search
npm start

# Orders
cd orders
npm start
```

The main application will be available at `http://localhost:3000`

## Development

Each micro-frontend is configured with:

- TypeScript support
- Webpack Module Federation
- Tailwind CSS
- Jest for testing
- React and Redux Toolkit

## Testing

Each micro-frontend and the server include Jest for testing. To run tests:

```bash
npm test        # Run tests once
npm test:watch  # Run tests in watch mode
```

## Building for Production

1. Build each micro-frontend:

```bash
cd [micro-frontend-directory]
npm run build
```

2. Build the server:

```bash
cd server
npm run build
```

## Deployment

For production deployment:

1. Update the webpack configurations in each micro-frontend to use production URLs instead of localhost.

2. Deploy each micro-frontend to a static hosting service (e.g., AWS S3, Netlify, Vercel).

3. Deploy the server to a Node.js hosting platform (e.g., AWS EC2, Heroku).

4. Update the ModuleFederationPlugin remotes in the host application's webpack config to point to the production URLs.

## Architecture Details

### Host Application

- Main application shell
- Manages routing
- Handles state management (Redux store)
- Exposes shared components and utilities

### Micro-frontends

Each micro-frontend:

- Is independently deployable
- Has its own build pipeline
- Shares common dependencies through Module Federation
- Uses Tailwind CSS for styling
- Implements TypeScript for type safety

### Backend Server

- RESTful API built with Express.js
- MongoDB database
- JWT authentication
- TypeScript implementation
