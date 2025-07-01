'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

const Revision = sequelize.define('revision', {
  rev_id: {
    type: Sequelize.STRING,    
    primaryKey: true,
    field: 'rev_id'
  },
  issue_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    foreignKey: true,
    field: 'issue_id'
  },
  updated_issue: Sequelize.JSON,
  changes: Sequelize.JSON,  
  updated_by: {
    type: Sequelize.STRING,
    // Task 5: Every time a change is made to the DB, store the change author’s email address
    validate: {
      isEmail: true
    },
    defaultValue: 'unknown'
  },
  updated_at: {
    type: Sequelize.DATE
  }
}, {
  timestamps: false,
  tableName: 'revisions'
});

Revision.sync().then(() => console.log("Revision sync complete"));

module.exports = Revision