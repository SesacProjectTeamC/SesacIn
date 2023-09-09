exports.main = (req, res) => {
  res.render("index");
};

exports.login = (req, res) => {
  res.render("login", {
    title: "test",
  });
};

exports.login = (req, res) => {
  res.render("login",{
    title: "test",
    uId: req.body, 
    pw: req.body ,
  })
}