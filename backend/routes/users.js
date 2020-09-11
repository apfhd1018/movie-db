const router = require("express").Router();
let User = require("../models/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// ==================유저 등록 ===================
router.post("/add", async (req, res) => {
  //유저 생성 전 Validation
  const { error } = registerValidation(req.body);
  //유저 등록 할 때 Validation조건 만족 안할시 에러메세지 보냄
  if (error) return res.status(400).send(error.details[0].message);

  // username이 DB에 존재하는지 체크
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("username already exists.");
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  console.log("========= api =========");
  console.log(req.body);
  const username = req.body.username;
  const password = hashedPassword;

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    res.send("User was added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
// =================유저등록 끝===================

// =============로그인===============

router.post("/login", async (req, res) => {
  //로그인 전 Validation
  const { error } = loginValidation(req.body);
  //로그인 할 때 Validation조건 만족 안할시 에러메세지 보냄
  if (error) return res.status(400).send(error.details[0].message);
  // username이 DB에 없으면 에러메세지 보냄
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username is not found.");
  // 비밀번호 검사
  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd) return res.status(400).send("Invalid Password.");

  // 토큰 발급
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send("Logged in!");
});

// ==============로그인 끝=============

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
