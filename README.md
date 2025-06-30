# Bug-and-revision-tracker
Tracks bugs and compares revisions of bugs reported

# BACKEND PROJECT

## Description

All projects contain issues. Issues describe problems and bugs, found by testers in client applications. Your job is to create a simple REST API to manage issue entities.

## Development environment

The repo contains a simplistic Docker Compose setup to make your life easier, but you are free to modify it or use a different toolset based on your preferences.

1. Install Docker and Docker Compose on your machine.

2. Build and run the Docker containers using the following command:
    ```bash
    docker-compose up --build -d
    ```

3. The API will be available at http://localhost:8080.

4. You can connect to the database from any MySQL client. It's available at localhost:3307 with the root user & the password you find in `.env`.

* Basics of the REST API using [Node.js](https://nodejs.org) and [koa](http://koajs.com/)
* MySQL database with a table for issues
* [Sequelize](http://docs.sequelizejs.com/) model for issues

A sample issue to illustrate the issue item structure:

```json
{
    "id": 123,
    "title": "Bug in issue-service",
    "description": "Ah snap :("
}
```  

### Task 1: Implement an endpoint that creates a new issue

### Task 2: Implement an endpoint that lists all stored issues

### Task 3: Implement an endpoint that modifies an issue

### Task 4: Implement issue revisions

Issues being one of the central models, it is important to track the changes made to them. Every time a change is made to an issue, we want to track what exactly was changed, by whom and when.

Each change is a **revision**, containing the issue current state and the changes made.

_For example:_

```json
{
    "issue": {
        "title": "Bug in issue-service",
        "description": "It does not generate revisions"
    },
    "changes": {
        "description": "It does not generate revisions"
    },
    "updatedAt": "2024-03-29T15:40:42.000Z"
}
```

Requirements:

* Store issue revision when creating a new issue
* Store issue revision when updating an issue
* Implement a new endpoint that returns all revisions of a particular issue  

### Task 5: Implement authentication

* Require a valid JWT token to be present for all requests (except for the discovery and health endpoints)
* Clients must include an X-Client-ID header in every request. 
* Every time a change is made to the DB, store the change author's email address (i.e. `created_by`, `updated_by`).  

### Task 6: Before and after comparison

Create an endpoint that takes two revisions of a particular issue and returns the difference between the two.

The response object should contain the following data pieces:
* `before`: the issue's content at revision A
* `after`: the issue's content at revision B
* `changes`: summary of the differences (i.e. listing all properties that have changed and their values)
* `revisions`: the full trail of revisions between version A and B

By default the comparison can work from older to newer revisions, but for bonus points you can implement comparisons from newer to older revisions as well.

