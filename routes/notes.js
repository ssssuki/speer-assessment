const router = require("express").Router();

module.exports = (db) => {
  router.get("/notes", (request, response) => {
    db.query(`SELECT * FROM notes WHERE user_id = $1;`, [request.userId])
      .then(({ rows: notes }) => {
        response.json(notes);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.get("/notes/:id", (request, response) => {
    db.query(`SELECT * FROM notes WHERE id = $1 AND (user_id = $2 OR $3 = ANY(shared_with));`, [request.params.id, request.userId, request.userId])
      .then(({ rows: notes }) => {
        response.json(notes);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.post("/notes", (request, response) => {
    db.query(`INSERT INTO notes (user_id, content, shared_with) VALUES ($1, $2, '{}') RETURNING id;`, [request.userId, request.body.content])
      .then(({ rows: ids }) => {
        response.json(`Successfully posted a note! The post ID is ${ids[0].id}`);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.put("/notes/:id", (request, response) => {
    db.query(`UPDATE notes SET content = $1 WHERE id = $2 AND user_id = $3;`, [request.body.content, request.params.id, request.userId])
      .then((res) => {
        response.json(`Successfully updated the note!`);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.delete("/notes/:id", (request, response) => {
    db.query(`DELETE FROM notes WHERE id = $1 AND user_id = $2;`, [request.params.id, request.userId])
      .then((res) => {
        response.json(`Successfully deleted the note!`);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.get("/search", (request, response) => {
    console.log(request.query);
    db.query(`SELECT * FROM notes WHERE user_id = $1 AND content LIKE $2;`, [request.userId, `%${request.query.q}%`])
      .then(({ rows: notes }) => {
        response.json(notes);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.post("/notes/:id/share", (request, response) => {
    db.query(`UPDATE notes SET shared_with = array_append(shared_with, $1) WHERE id = $2 AND user_id = $3;`, [request.body.user_id, request.params.id, request.userId])
      .then(({ rows: ids }) => {
        response.json(`Successfully shared the note with user ${request.body.user_id}!`);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });
  return router;
};