function index(req, res) {
  res.render("home", { user: req.user });
}

function test(req, res) {
  const { name } = req?.body;
  res.render("home", { name, user: req.user });
}

module.exports = { index, test };
