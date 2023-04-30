# speer-assessment

## Introduction

For this assessment, I'm using express as the framework for the server and PostgreSQL as the database. Here're some of the 3rd party tools I used:

* `jsonwebtoken`: to generate token for authentication
* `bcryptjs`: to generate hash for passwords
* `pg`: to connect to PostgreSQL
* `mocha` and `chai`: for tests

## How to run locally

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
1. Update the .env file with your correct local information
1. Install dependencies: `npm install`
1. Initialize your DB using the DB schema files in `db/schema` folder
1. Run the server: `npm start`

## How to run tests

Run `npm test`