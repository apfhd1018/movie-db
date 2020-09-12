const router = require("express").Router();
const authenticateToken = require("./authenticateToken");

router.get("/", authenticateToken, (req, res) => {
  res.json({ title: "you have a authentication!" });
});
module.exports = router;
