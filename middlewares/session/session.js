const session = require('express-session');
const { SESSION_KEY } = process.env;

const sessionConfig = {
  secret: SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 1000 * 60, // 1시간
  },
};

module.exports = function configureSession(app) {
  app.use(session(sessionConfig));
};
