import React, { useState } from "react";
import Heart from "react-animated-heart";
import axios from "axios";

const Favorite = ({
  userFrom,
  movieId,
  movieTitle,
  moviePoster,
  setClick,
  isClick,
}) => {
  const [favorited, setFavorited] = useState(true);

  const variable = {
    userFrom: sessionStorage.getItem("userId"),
    movieId: movieId,
    movieTitle: movieTitle,
    moviePoster: moviePoster,
  };
  const accessToken = sessionStorage.getItem("accessToken");

  //  좋아요를 누른 기록이 있으면 favorited => true
  axios
    .post("http://localhost:5000/api/private/favorited", variable, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      if (res.data.success) {
        // 데이터 있으면 favorited=>true , 없으면 favorited=>false
        setFavorited(res.data.favorited);
      } else {
        alert("Favorite 정보 가져오지 못함!");
      }
    });

  // ===================================
  //   하트를 눌렀을때 발생하는 이벤트
  // ===================================
  const onClickFavorite = () => {
    // 좋아요를 이미 눌렀을 경우(favorited가 true일때)
    if (favorited) {
      axios
        .post(
          "http://localhost:5000/api/private/removeFromFavorite",
          variable,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            setClick(!favorited);
            setFavorited(!favorited);
          } else {
            console.log("favorite콜렉션에서 제거하지 못함");
          }
        });
    } else {
      // 좋아요 최초로 누를 경우 : variable 정보를 FavoritePage로 넘김.
      // favorited가 false인 경우
      axios
        .post("http://localhost:5000/api/private/addToFavorite", variable, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setClick(!favorited);
            setFavorited(!favorited);
          } else {
            console.log("추가하지 못했습니다");
          }
        });
    }
  };

  return (
    <div>
      <div className="App">
        <Heart isClick={isClick} onClick={onClickFavorite} />
        <div className="add">Add to Favorite!</div>
      </div>
    </div>
  );
};

export default Favorite;
