import React, { useState, useEffect } from "react";
import Heart from "react-animated-heart";
import axios from "axios";

const Favorite = (props) => {
  const [isClick, setClick] = useState(false);
  const [favoriteNumber, setFavoriteNumber] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const userFrom = props.userFrom;
  const movieId = props.movieId;
  const movieTitle = props.movieTitle;
  const moviePoster = props.moviePoster;

  const variable = {
    userFrom: userFrom,
    movieId: movieId,
    movieTitle: movieTitle,
    moviePoster: moviePoster,
  };
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/private/favoriteNumber", variable, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFavoriteNumber(res.data.favoriteNumber);
        } else {
          alert("Failed to get favoriteNumber!");
        }
      });

    axios
      .post("http://localhost:5000/api/private/favorited", variable, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFavorited(res.data.favorited);
        } else {
          alert("Favorite 정보 가져오지 못함!");
        }
      });
  }, []);

  const onClickFavorite = () => {
    if (favorited) {
      // 이미 좋아요 누른 경우
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
            setFavoriteNumber(favoriteNumber - 1);
            setFavorited(!favorited);
            setClick(!isClick);
          } else {
            alert("favorite콜렉션에서 제거하지 못함");
          }
        });
    } else {
      // 아직 좋아요 안누른 경우
      axios
        .post("http://localhost:5000/api/private/addToFavorite", variable, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setFavoriteNumber(favoriteNumber + 1);
            setFavorited(!favorited);
            setClick(!isClick);
          } else {
            alert("추가하지 못했습니다");
          }
        });
    }
  };

  return (
    <div>
      <div className="App">
        <Heart isClick={isClick} onClick={onClickFavorite} />
        <div className="add">
          {/* {favorited ? "Remove From Favorite" : "Add to Favorite"} */}
          {favoriteNumber} people likes
        </div>
      </div>
    </div>
  );
};

export default Favorite;
