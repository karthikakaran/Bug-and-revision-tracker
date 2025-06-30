'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// Task 5: Require a valid JWT token to be present for all requests
const jwt = require('koa-jwt');
const dotenv = require('dotenv');

const config = require('./config');
const router = require('./lib/routes');
const respond = require('./lib/api/responses');

require('./lib/models/relation');

const app = new Koa();

dotenv.config(); // Load .env variables

app.use(bodyParser({
  enableTypes: ['json'],
  encoding: 'utf-8'
}));

app.use(router.routes());
app.use(router.allowedMethods());

// Task 5: Clients must include an X-Client-ID header in every request
const requireClientId = async (context, next) => {
  const clientId = context.request.headers['x-client-id'];

  if (!clientId) {
    respond.badRequest(context, { 'Error': 'X-Client-ID header is required' });
    return;
  }

  await next();
};
app.use(requireClientId);

// Task 5: Require a valid JWT token to be present for all requests
const secret = process.env.JWT_SECRET;
app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      respond.unAuthorized(context, 'Invalid or missing JWT token');
    }
  }
});
app.use(jwt({ secret: secret }));

app.listen(config.port);
console.log('Listening on http://localhost:%s/', config.port);

// Exporting for tests
exports.module = app;