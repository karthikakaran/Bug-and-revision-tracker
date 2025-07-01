'use strict';

const Router = require('koa-router');
const router = new Router();

// Task 5: Require a valid JWT token to be present for all requests
const jwtUserState = async (context) => {
    // context.state.user contains the decoded JWT payload
    context.body.user = context.state.user;
    await next();
}

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));
router.get('/issues/:id', require('./api/issues').getById, jwtUserState);
router.get('/issues/', require('./api/issues').get, jwtUserState); // Task 2: Implement an endpoint that lists all stored issues
router.post('/issues/', require('./api/issues').create, jwtUserState); // Task 1: Implement an endpoint that creates a new issue
router.put('/issues/:id', require('./api/issues').modify, jwtUserState);// Task 3: Implement an endpoint that modifies an issue

// Task 4: Implement issue revisions - endpoint that returns all revisions of a particular issue
router.get('/revisions/:id', require('./api/revisions').revisionsForIssue, jwtUserState);
// Task 6: Before and after comparison
router.get('/revisions/:id/:rev1/:rev2', require('./api/revisions').revisionCompare, jwtUserState);

module.exports = router;
