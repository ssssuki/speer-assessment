const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const token = req.body.token;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, userId) => {
    if (err) return res.sendStatus(403);
    req.userId = userId;
    next();
  })
};

module.exports = authenticateToken;
