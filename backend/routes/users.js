const router = require("express").Router();
let User = require("../models/user.model");
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

//연습@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

router.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});
// 생성되는 refresh 토큰을 배열에 담음
let refreshTokens = [];
// refresh토큰에 요청
router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  // verify를 통해 권한을 확인한다.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
router.post("/posts/login", (req, res) => {
  // Authenticate User

  const username = req.body.username;
  const user = { name: username };
  // accessToken 생성
  const accessToken = generateAccessToken(user);
  // refreshToken 생성
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
router.delete("/posts/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

// 연습끝@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
router.get("/", (req, res) => {
  // try {
  //   await User.find();
  //   res.json(users);
  // } catch (err) {
  //   res.status(400).json("Error: " + err);
  // }
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// =========================유저 등록 ==========================
router.post("/add", async (req, res) => {
  //유저 생성 전 Validation @hapi/joi
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
    res.send("User added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
// ========================유저등록 끝==========================

// ====================로그인======================

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
  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
  res.header("auth-token", token).send(token);
});

// =====================로그인 끝=======================

// =====================로그아웃========================

router.delete("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) send("there is no token");
    const userId = await verifyToken(token);
  } catch (error) {
    next(error);
  }
});

// =====================로그아웃========================
// ============id 통한 유저 검색, 삭제, 업데이트================
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/update/:id", (req, res) => {
  User.findById(req.params.id).then((user) => {
    user.username = req.body.username;
    user.password = req.body.password;

    user
      .save()
      .then(() => res.json("User updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});
// ============id 통한 유저 검색, 삭제, 업데이트 끝================

module.exports = router;
