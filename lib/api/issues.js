'use strict';

const sequelize = require('../models/connection');

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');

const helpers = require('./helpers');

const Issues = {};

Issues.getById = async (context) => {
  const issue = await Issue.findByPk(context.params.id);
  respond.success(context, issue);
};

// Task 2: Implement an endpoint that lists all stored issues
Issues.get = async (context) => {
  const issues = await Issue.findAll();
  respond.success(context, issues);
};

// Task 1: Implement an endpoint that creates a new issue
Issues.create = async (context) => {
  // title, description, created_by in data
  const data = context.request.body;

  if (!data || !data.title || !data.description || !data.created_by) {
    respond.badRequest(context, {'Error': 'Title, Description and CreatedBy should not be empty'});
    return;
  }
  
  // Use a transaction for atomicity
  const result = await sequelize.transaction(async t => {
      data.revision = [ {rev_id: 'Revision_A', updated_issue: { title: data.title, description: data.description }, changes: {}, updated_by: data.created_by} ];
      // Task 4 : Store issue revision when creating a new issue
      // Create Issue and corresponding revision
      const issue_revision = await Issue.create(data, { transaction: t,  
                                include: [{
                                    model: Revision,
                                    as: 'revision'
                                }]
                          });

      return { issue_revision };
  });
  respond.success(context, result);
};

// Task 3: Implement an endpoint that modifies an issue
Issues.modify = async (context) => {
  const data = context.request.body;
  if (!data || !data.updated_by) {
    respond.badRequest(context, {'Error': 'Update data and UpdatedBy should not be empty'});
    return;
  }
  for (const key in data) {
    if(!data[key]) {
      respond.badRequest(context, {'Error': key + ' should not be empty'});
      return;
    }
  }

  // Get existing issue content to find change
  const beforeUpdateIssue = await Issue.findByPk(context.params.id);
  if (!beforeUpdateIssue) {
    respond.success(context, beforeUpdateIssue);
    return;
  }

  // Use a transaction for atomicity
  const result = await sequelize.transaction(async t => {
      // Update Issue      
      const issueCount = await Issue.update (
        data,
        {
          where: {
            id: context.params.id,
          }
        },
        { transaction: t });


      const beforeTitle = beforeUpdateIssue.title;
      const beforeDescription = beforeUpdateIssue.description;

      // Get updated issue
      await beforeUpdateIssue.reload();

      // To calculate Revision ID
      const revCount = await Revision.count({
        where: {
          issue_id: context.params.id,
        },
      });
      
      let revisionData = { rev_id: 'Revision_' + helpers.base26_chars(revCount), issue_id: beforeUpdateIssue.id,
         updated_issue: { title: beforeUpdateIssue.title, description: beforeUpdateIssue.description },  
         changes: {}, updated_by: data.updated_by };
      
      // Find changed
      if (beforeTitle !== beforeUpdateIssue.title) {
        revisionData.changes['title'] = beforeUpdateIssue.title;
      }
      if (beforeDescription !== beforeUpdateIssue.description) {
        revisionData.changes['description'] = beforeUpdateIssue.description;
      }

      // Task 4: Store issue revision when updating an issue  
      // Create revision correspondingly
      const revision = await Revision.create( revisionData, { transaction: t });

      return revision;
  });

  respond.success(context, result);
};

module.exports = Issues;
