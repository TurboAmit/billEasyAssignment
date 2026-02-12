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
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 20 },
        { duration: '30s', target: 20 },
        { duration: '10s', target: 0 },
      ],
    },
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 50 },
        { duration: '10s', target: 50 },
        { duration: '5s', target: 0 },
      ],
      startTime: '55s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
    errors: ['rate<0.02'],
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

// export function handleSummary(data) {
//     return {
//         "K6report.html": htmlReport(data),
//     }
// }

