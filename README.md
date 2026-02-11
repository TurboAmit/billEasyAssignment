# BillEasyAssignment

## 📌 Summary
This repository contains automated test scripts built using **Playwright** to validate critical workflows on the [SauceDemo](https://www.saucedemo.com/) platform.

The automation covers the following scenarios:

- ✅ Login with valid credentials  
- ❌ Login with invalid credentials  
- 🛒 Add single and multiple items to the cart  
- 📦 Navigate through the inventory page  
- 🧾 Complete checkout workflow (including validation for missing fields)

The tests are designed to run both locally and in a Continuous Integration (CI) environment such as **GitHub Actions**.

---

## 🛠 Tools and Technologies Used

- **Node.js** (v18 or higher)
- **Playwright**
- **TypeScript**
- **Visual Studio Code (VS Code)**
- **GitHub Actions** (CI/CD)
- **Claude AI** (used during development assistance)

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/TurboAmit/billEasyAssignment.git
cd billEasyAssignment
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Install Playwright Browsers

Playwright requires browser binaries to execute tests:

```bash
npx playwright install
```

---

## ▶️ Running the Tests

### Run tests in headless mode (recommended for CI/CD)

```bash
npx playwright test --headless
```

### Run tests in headed mode (for debugging)

```bash
npx playwright test --headed
```

### Run tests with UI mode (optional)

```bash
npx playwright test --ui
```

---

## 📁 Project Structure

```
billEasyAssignment/
│
├── tests/                   # Playwright test scripts
│   ├── login.spec.ts        # Login workflow tests
│   ├── cart.spec.ts         # Cart functionality tests
│   └── checkout.spec.ts     # Checkout workflow tests
│
├── playwright.config.ts     # Playwright configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 🔄 CI/CD Integration

This project supports execution in CI environments like **GitHub Actions**.  
Tests run automatically in headless mode during pipeline execution.

---

## 📧 Author

**Amit Pandagre**
