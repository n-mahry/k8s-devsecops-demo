const http = require('http');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

process.env.PORT = 3001;
require('./index.js');

setTimeout(() => {
  const checks = [
    { path: '/',       expectStatus: 200, expectKey: 'message' },
    { path: '/health', expectStatus: 200, expectKey: 'status'  },
    { path: '/nope',   expectStatus: 404, expectKey: 'error'   },
  ];

  let done = 0;

  checks.forEach(({ path, expectStatus, expectKey }) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const json = JSON.parse(body);
        assert(`GET ${path} → ${expectStatus}`, res.statusCode === expectStatus);
        assert(`GET ${path} has "${expectKey}"`, expectKey in json);

        done++;
        if (done === checks.length) {
          console.log(`\n${passed} passed, ${failed} failed`);
          process.exit(failed > 0 ? 1 : 0);
        }
      });
    });
  });
}, 200);
