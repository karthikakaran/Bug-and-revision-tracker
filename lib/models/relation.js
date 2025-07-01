const revision = require('./revision');
const issue = require('./issue');

issue.hasMany(revision, {
  foreignKey: 'issue_id',
  as: 'revision'
});

revision.belongsTo(issue, { 
  foreignKey: 'issue_id',
  as: 'issue'
});