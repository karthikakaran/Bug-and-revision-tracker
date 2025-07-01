const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

const Issue = require('../lib/models/issue');
const Issues = require('../lib/api/issues');

// Helper function to create a test issue
const createTestIssue = async (title = 'Bug in issue-service', description = 'New bug', created_by = 'test@example.com') => {
  return await request(server).post('/items').send({ name: 'Item One' });
};

describe('Issue API Tests', () => {
  let server;

  before(async () => {
    // Make sure this is awaited, especially if it involves DB sync
    await Issue.sync({ force: true });
    server = app.listen(); // This returns a Promise in Koa 2.x, so it's awaitable
    await server; // Await the server startup if needed, though supertest usually handles this
  });

  after((done) => {
    // Close the ephemeral server started by Supertest
    server.close(done);
  });
  
  // --- GET /issue/:id ---
  describe('GET /issues/:id', () => {
    it('should return a issue by ID', async () => {
      const issue = await createTestIssue('New bug reported', 'New bug in system', 'user@example.com', 'user@example.com');
      const res = router
        .get(`/issues/1`)  
        .expect(200);
            
      console.log(res.body);      
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id', issue.id);
      expect(res.body).to.have.property('title', issue.title);
      expect(res.body).to.have.property('description', issue.description);
      expect(res.body).to.have.property('created_by', issue.created_by);
    });

    it('should return 204 if issue not found', async () => {
      const res = await request(server)
        .get('/issues/99') // Non-existent ID
        .expect(204);

      // expect(res.body).to.be.empty();      
      expect(res.status).to.eq('204 No Content');
    });
  });
});