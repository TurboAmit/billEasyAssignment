# BillEasyAssignment

## 📌 Summary

This repository contains:

1️⃣ **UI Test Automation Framework** built using **Playwright + TypeScript**  
2️⃣ **API Load Testing Implementation** using **K6**

The project validates critical workflows on the [SauceDemo](https://www.saucedemo.com/) platform and demonstrates performance testing using a public API.

---

# 🧪 Part 1: UI Automation (Playwright)

## ✅ Test Scenarios Covered

- Login with valid credentials  
- Login with invalid credentials  
- Add single item to cart  
- Add multiple items to cart  
- Navigate through inventory page  
- Complete checkout workflow  
- Validation for missing checkout fields  

(5+ test cases as required)

---

## 🏗 Framework Design

The framework follows:

- **Page Object Model (POM)** design pattern
- Reusable page classes
- Clear test separation
- Configurable Playwright setup

---

## 🛠 Tools and Technologies Used

- **Node.js** (v18+)
- **Playwright**
- **TypeScript**
- **Visual Studio Code**
- **GitHub Actions (CI/CD)**
- **K6 (Load Testing)**
- **ChatGPT** (used for documentation guidance and load test structuring)

---

# 🚀 Setup Instructions

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/TurboAmit/billEasyAssignment.git
cd billEasyAssignment
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Install Playwright Browsers

```bash
npx playwright install
```

---

# ▶️ Running Playwright Tests

### Headless Mode (CI Recommended)

```bash
npx playwright test --headless
```

### Headed Mode (Debugging)

```bash
npx playwright test --headed
```

### UI Mode (Optional)

```bash
npx playwright test --ui
```

---

# 📊 Part 2: Load Testing (K6)

Load testing is implemented using **K6 (JavaScript-based performance testing tool)**.

Target API:
```
https://jsonplaceholder.typicode.com
```

---

## 📂 Load Test Execution

### Install K6

### Mac
```bash
brew install k6
```

### Windows
```bash
choco install k6
```

### Linux
```bash
sudo apt install k6
```

---

### Run Load Test

```bash
k6 run load-tests/load-test.js
```

If HTML reporting is enabled:

```bash
k6 run load-tests/load-test.js
```

This generates:
```
k6-report.html
```

---

# 📁 Updated Project Structure

```
billEasyAssignment/
│
├── tests/                     # Playwright test scripts
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
│
├── pages/                     # Page Object Model classes
│
├── load-tests/
│   └── load-test.js           # K6 load testing script
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🧠 Load Testing Theory

## 1️⃣ Load Testing
Tests system performance under expected user load.

**Purpose:**
- Validate response times
- Detect bottlenecks
- Ensure system stability

---

## 2️⃣ Stress Testing
Pushes system beyond capacity to identify breaking point.

**Purpose:**
- Observe failure behavior
- Evaluate recovery

---

## 3️⃣ Spike Testing
Tests sudden increase in traffic.

**Purpose:**
- Validate handling of traffic spikes
- Detect scaling delays

---

## 4️⃣ Soak / Endurance Testing
Runs system under load for extended duration.

**Purpose:**
- Detect memory leaks
- Identify performance degradation

---

## 5️⃣ Scalability Testing
Measures system performance as load increases gradually.

**Purpose:**
- Validate infrastructure scaling
- Measure performance improvements

---

# 📈 Key Metrics Monitored

During load testing, the following metrics are analyzed:

### 1️⃣ Response Time
- **Average (avg)** → Overall system speed
- **p95** → 95% of users experience this response time or better
- **p99** → Worst-case performance indicator

---

### 2️⃣ Throughput
- Requests per second (RPS)
- Measures system capacity

---

### 3️⃣ Error Rate
- Percentage of failed requests
- Should remain within defined thresholds (<2%)

---

# 📊 Expected Results Analysis

After execution, K6 provides:

- `http_req_duration` (avg, p95, p99)
- `http_req_failed`
- Requests per second
- Virtual users (VUs)

### Example Interpretation:

✔ p95 < 800ms → System performing within SLA  
✔ Error rate < 2% → Stable under load  
✔ Stable throughput → No bottlenecks detected  

If p95 or error rate increases significantly, system optimization is required.

---

# 🔄 CI/CD Integration

Playwright tests are configured to run in **headless mode** within CI pipelines such as GitHub Actions.

---

# 👤 Author

**Amit Pandagre**
