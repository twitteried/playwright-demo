# Playwright E2E Testing Framework with Demo App

This project was vibe-coded in about hour, so it might have some quirks, but contains a complete end-to-end testing solution with:

1. A demo Express.js web application with login, dashboard, and products pages
2. A Playwright-based test framework following OOP principles

## Project Structure

```
playwright-e2e-demo/
├── demo-app/          # Express.js demo application
│   ├── data/          # Test data (users, products)
│   ├── public/        # Static assets
│   ├── views/         # EJS templates
│   └── server.js      # Express.js server
│
└── test-suite/        # Playwright test framework
    ├── src/
    │   ├── pages/     # Page Object Models
    │   ├── components/# UI Components
    │   ├── data/      # Test data
    │   ├── utils/     # Utilities
    │   └── tests/     # Test files
    └── playwright.config.ts
```

## Running the Demo

### Step 1: Start the Demo App

```bash
cd demo-app
npm install
npm start
```

The demo app will run on http://localhost:3000

### Step 2: Run the Tests

In a separate terminal:

```bash
cd test-suite
npm install
npx playwright install  # Install browser dependencies
npm test                # Run all tests
```

## Demo App Features

- Login with different user roles (admin, manager, customer)
- Dashboard with stats and recent activity
- Product listing with search, filter, and sort capabilities
- Role-based navigation items

## Test Framework Features

- Page Object Model pattern
- Parallel test execution support
- Cross-browser testing

## Test Commands

```bash
npm test               # Run all tests
npm run test:headed    # Run tests with browser visible
npm run test:debug     # Run tests in debug mode
npm run test:parallel  # Run tests with parallel workers
npm run report         # Show test reports
```

## Demo Users

- Admin: admin@example.com / admin_password
- Manager: manager@example.com / manager_password
- Customer: customer@example.com / customer_password
