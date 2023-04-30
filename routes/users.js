const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET);
}

module.exports = (db) => {
  router.post("/signup", (request, response) => {
    const salt = bcrypt.genSaltSync(10)
    const password = bcrypt.hashSync(request.body.password, salt)

    db.query(`INSERT INTO users (username, pwd) VALUES ($1, $2) RETURNING id;`, [request.body.username, password])
      .then(({ rows: ids }) => {
        response.json(`Successfully signed up! Your user ID is ${ids[0].id}`);
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  router.post("/login", (request, response) => {
    db.query(`SELECT * FROM users WHERE username = $1;`, [request.body.username])
      .then(({ rows: users }) => {
        if (users.length == 0) {
          response.sendStatus(401);
        } else {
          const match = bcrypt.compareSync(request.body.password, users[0].pwd);

          if (!match) {
            response.sendStatus(401);
          } else {
            const token = generateAccessToken(users[0].id);
            response.json(`Successfully logged in! Your token is ${token}`);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        response.sendStatus(503);
      });
  });

  return router;
};