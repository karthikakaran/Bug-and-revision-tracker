'use strict';

const { Op } = require('sequelize');

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');

const Revisions = {};

// Task 4: Implement issue revisions - endpoint that returns all revisions of a particular issue
Revisions.revisionsForIssue = async (context) => {
  const revisions = await Issue.findByPk(context.params.id, {
                                include: [{
                                    model: Revision,
                                    as: 'revision',
                                    attributes: ['rev_id', 'updated_issue', 'changes', 'updated_at']
                                }],
                                model: Issue,
                                as: 'issue',
                                attributes: ['title', 'description']
                    });

  respond.success(context, revisions);
};

// Task 6: Before and after comparison
Revisions.revisionCompare = async (context) => {
  // Both Older to newer revisions and Newer to older versions work
  const earlyRevision = context.params.rev1 < context.params.rev2 ? context.params.rev1 : context.params.rev2;
  const lastRevision = context.params.rev1 > context.params.rev2 ? context.params.rev1 : context.params.rev2;
  const revisions = await Issue.findByPk(context.params.id, {                               
                                include: [{
                                    model: Revision,
                                    as: 'revision',
                                    where: {
                                        issue_id: context.params.id,
                                        rev_id: {
                                          [Op.gte]: earlyRevision,
                                          [Op.lte]: lastRevision,
                                        }
                                    },
                                    attributes: ['rev_id', 'updated_issue', 'changes', 'updated_at']
                                }],
                                model: Issue,
                                as: 'issue',
                                attributes: ['title', 'description']
                    });
  
  // Format data                    
  let result = {};

  if (revisions) {
    // Before - the issue’s content at revision A
    // After - the issue’s content at revision B 
    for (let revision of revisions.revision) {
      if (revision.rev_id == earlyRevision) {
        result.before = revision.updated_issue;
      }
      if (revision.rev_id == lastRevision) {
        result.after = revision.updated_issue;
      }
    }
    // Changes summary - summary of the differences (i.e. listing all properties that have changed and their values)
    result.changes = {};
    if (result.before?.title !== result.after?.title) {
      result.changes.title = { earlyRevision : result.before?.title, lastRevision : result.after?.title };
    }
    if (result.before?.description !== result.after?.description) {
      result.changes.description = { earlyRevision : result.before?.description, lastRevision : result.after?.description };
    }
    // Full trail of revisions between version A and B
    result.revisions = revisions?.revision;
  }

  respond.success(context, result);                    
}

module.exports = Revisions;
