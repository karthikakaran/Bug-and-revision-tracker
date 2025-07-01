'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

const Issue = sequelize.define('issue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  created_by: {
    type: Sequelize.STRING,
    // Task 5: Every time a change is made to the DB, store the change author’s email address
    validate: {
      isEmail: true
    },
    defaultValue: 'unknown'
  },
  updated_by: {
    type: Sequelize.STRING,
    // Task 5: Every time a change is made to the DB, store the change author’s email address
    validate: {
      isEmail: true
    },
    defaultValue: 'unknown'
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'issues'
});

Issue.sync().then(() => console.log("Issue sync complete"));

module.exports = Issue;