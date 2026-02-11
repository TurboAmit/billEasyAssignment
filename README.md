# BillEasyAssignment

## Summary
This repository contains automated test scripts using **Playwright** to validate critical workflows on the [SauceDemo](https://www.saucedemo.com/) platform. The scripts perform the following actions:

- Log in with valid and invalid credentials.
- Navigate through the inventory page.
- Add single and multiple items to the cart.
- Proceed through checkout steps (including error handling for missing fields).

The tests are designed to run both locally and in a continuous integration (CI) environment such as GitHub Actions.

---

## Tools and Technologies Used
- **Node.js** (version 18 or higher)
- **Visual Studio Code (VS Code)**
- **Playwright**: For browser automation.
- **TypeScript**: For type-safe automation scripts.
- **GitHub Actions**: For CI/CD automation.
- **claude**: AI tool used during development.

---

## Setup Instructions

### Install Dependencies
Playwright requires browser binaries to run tests. Install them with:
```bash
npx playwright install

Clone the repository and install required packages:
git clone https://github.com/TurboAmit/billEasyAssignment.git
cd billEasyAssignment
npm install

Run tests in headless mode for CI/CD pipelines:
npx playwright test --headless

Run tests in headed mode for debugging:
npx playwright test --headed
