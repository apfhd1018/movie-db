const router = require("express").Router();
let User = require("../models/user.model");
let Favorite = require("../models/favorite.model");
const authenticateToken = require("./authenticateToken");
const jwt = require("jsonwebtoken");

// defalut경로 : api/private
router.get("/", authenticateToken, (req, res) => {
  res.json({ title: "you have a authentication!" });
});

// movie list 검색
router.get("/favorite", authenticateToken, async (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("리스트에러" + err));
});

// 좋아요 누를 때 숫자 증감
router.post("/favoriteNumber", authenticateToken, (req, res) => {
  //Favorite정보를 Movie ID를 통해 찾는다
  Favorite.find({ movieId: req.body.movieId }).exec((err, favorite) => {
    if (err) return res.status(400).send("영화정보없음!" + err);
    res.json({ success: true, favoriteNumber: favorite.length });
  });
});

// 좋아요 최초이거나 누른사용자 검별
router.post("/favorited", authenticateToken, (req, res) => {
  // Favorite정보를 Favorite 콜렉션의 Movie ID와 userfrom을 통해 찾는다.
  Favorite.find({ movieId: req.body.movieId, useFrom: req.body.useFrom }).exec(
    (err, favorited) => {
      if (err) return res.status(400).send("유저와 영화정보없음 " + err);

      // 이미 유저가 favorite리스트에 추가했을경우 확인
      let result = false; // 아직 리스트 추가안함
      if (favorited.length !== 0) {
        result = true;
      }
      // let heartResult = false;
      // if (favorited.length !== 0) {
      //   heartResult = true;
      // }
      res
        .status(200)
        .json({ success: true, favorited: result, isClick: result });
    }
  );
});

// Favorite 컬렉션에 좋아요 누른 영화 전송
router.post("/addToFavorite", authenticateToken, (req, res) => {
  // favorite콜렉션에 영화와 유저id 정보를 저장
  const favorite = new Favorite(req.body);

  favorite.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.json({ success: true });
  });
});

// Favorite List에서 영화 삭제
router.post("/removeFromFavorite", authenticateToken, (req, res) => {
  //
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.json({ success: true, doc });
  });
});

// Favorite List에서 리스트 띄우기
router.post("/getFavoriteMovie", authenticateToken, (req, res) => {
  //
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
  });
});
module.exports = router;
