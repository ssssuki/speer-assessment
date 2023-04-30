const expect = require("chai").expect;
const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../db/connection");
const app = require("../app");
const users = require("../routes/users")(db);

describe("User Authentication", () => {
  before((done) => {
    db.query("TRUNCATE notes, users;").then(() => done()).catch((err) => done(err));
  });

  after((done) => {
    db.query("TRUNCATE notes, users;").then(() => done()).catch((err) => done(err));
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user and return user ID", (done) => {
      request(app)
        .post("/api/auth/signup")
        .send({ username: "testuser", password: "password123" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include(
            "Successfully signed up! Your user ID is"
          );
          done();
        });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return a JWT token for valid credentials", (done) => {
      request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "password123" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include("Successfully logged in! Your token is");
          done();
        });
    });

    it("should return an error for invalid username", (done) => {
      request(app)
        .post("/api/auth/login")
        .send({ username: "invaliduser", password: "password123" })
        .expect(401, done);
    });

    it("should return an error for invalid password", (done) => {
      request(app)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "invalidpassword" })
        .expect(401, done);
    });
  });
});