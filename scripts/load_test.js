import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Custom metrics
export const errorRate = new Rate('errors');
export const responseTimeTrend = new Trend('custom_response_time');

// Test configuration
export const options = {
  scenarios: {

    // Load Test
    load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
    },

    // Spike Test
    spike_test: {
      executor: 'ramping-vus',
      startTime: '2m',
      stages: [
        { duration: '10s', target: 100 },
        { duration: '30s', target: 100 },
        { duration: '10s', target: 0 },
      ],
    },

    // Stress Test
    stress_test: {
      executor: 'ramping-vus',
      startTime: '3m',
      stages: [
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 300 },
        { duration: '30s', target: 0 },
      ],
    },

    // Soak / Endurance Test
    soak_test: {
      executor: 'constant-vus',
      vus: 30,
      duration: '30m',
      startTime: '6m',
    },

    // 5️⃣ Scalability Test
    scalability_test: {
      executor: 'ramping-vus',
      startTime: '36m',
      stages: [
        { duration: '1m', target: 20 },
        { duration: '1m', target: 40 },
        { duration: '1m', target: 80 },
        { duration: '1m', target: 160 },
        { duration: '1m', target: 0 },
      ],
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
  },
};


export default function () {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'posts' },
  };

  // Request 1: All posts
  const res = http.get(`${BASE_URL}/posts`, params);

  // Request 2: Single post
  const res2 = http.get(`${BASE_URL}/posts/1`, params);

  // Checks
  const checkResult1 = check(res, {
    'posts status is 200': (r) => r.status === 200,
    'posts response time < 800ms': (r) => r.timings.duration < 800,
    'posts body not empty': (r) => r.body.length > 0,
  });

  const checkResult2 = check(res2, {
    'single post status is 200': (r) => r.status === 200,
  });

  // Track custom metrics
  errorRate.add(!(checkResult1 && checkResult2));
  responseTimeTrend.add(res.timings.duration);

  // Simulate user think time
  sleep(Math.random() * 2);
}

export function handleSummary(data) {
    return {
        "K6report.html": htmlReport(data),
    }
}

