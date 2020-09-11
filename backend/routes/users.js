const router = require("express").Router();
let User = require("../models/user.model");
const { registerValidation } = require("../validation/validation");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post(async (req, res) => {
  //유저 생성 전 Validation
  const { error } = registerValidation(req.body);
  //유저 등록 할 때 조건 만족 안할시 에러메세지 보냄
  if (error) return res.status(400).send(error.details[0].message);

  // username이 db에 존재하는지 체크
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("username already exists.");

  console.log("========= api =========");
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    res.json("User added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// id통한 유저 검색
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  User.findById(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id).then((user) => {
    user.username = req.body.username;
    user.password = req.body.password;

    user
      .save()
      .then(() => res.json("User updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
