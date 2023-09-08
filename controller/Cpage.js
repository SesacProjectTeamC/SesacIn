// const { Visitor } = require('../models');

exports.main = (req, res) => {
  res.render("index");
};

exports.login = (req, res) => {
  res.render("login", {
    title: "test",
  });
};
