const request = require("supertest");
const express = require("express");
const jest = require("jest-mock");
const app = express();
const expect = require("chai").expect;

// Mock database connection
const db = {
  query: jest.fn(),
};

// Inject the router
const noteRouter = require("../routes/notes")(db);
app.use(noteRouter);

describe("Note routes", () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  describe("GET /notes", () => {
    it("should return a list of notes", async () => {
      // Mock DB query result
      const notes = [{ id: 1, content: "Note 1" }, { id: 2, content: "Note 2" }];
      db.query.mockResolvedValueOnce({ rows: notes });

      // Send request to the router
      const response = await request(app).get("/notes").set("userId", 123);

      // Check the response
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.eql(notes);
    });

    it("should return a 503 error if the DB query fails", async () => {
      // Mock DB query error
      db.query.mockRejectedValueOnce(new Error("DB query failed"));

      // Send request to the router
      const response = await request(app).get("/notes").set("userId", 123);

      // Check the response
      expect(response.statusCode).to.equal(503);
    });
  });

  describe("GET /notes/:id", () => {
    it("should return a note if the user is the owner", async () => {
      // Mock DB query result
      const note = { id: 1, content: "Note 1", user_id: 123 };
      db.query.mockResolvedValueOnce({ rows: [note] });

      // Send request to the router
      const response = await request(app).get("/notes/1").set("userId", 123);

      // Check the response
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.eql([note]);
    });

    it("should return a note if the user is in the shared_with array", async () => {
      // Mock DB query result
      const note = { id: 1, content: "Note 1", user_id: 456, shared_with: [123] };
      db.query.mockResolvedValueOnce({ rows: [note] });

      // Send request to the router
      const response = await request(app).get("/notes/1").set("userId", 123);

      // Check the response
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.eql([note]);
    });

    it("should return a 503 error if the DB query fails", async () => {
      // Mock DB query error
      db.query.mockRejectedValueOnce(new Error("DB query failed"));

      // Send request to the router
      const response = await request(app).get("/notes/1").set("userId", 123);

      // Check the response
      expect(response.statusCode).to.equal(503);
    });
  });
});
