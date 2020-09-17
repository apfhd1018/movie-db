import React, { useState, useEffect } from "react";
import Heart from "react-animated-heart";
import axios from "axios";

const Favorite = (props) => {
  const [isClick, setClick] = useState(false);
  const [favoriteNumber, setFavoriteNumber] = useState(0);
  const [favorited, setFavorited] = useState(false);
  //   const [likes, setLikes] = useState(0);
  //   const [likeAction, setLikeAction] = useState(null);

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
  let userCondition = {
    movieId: movieId,
    userId: sessionStorage.getItem("userId"),
  };
  const accessToken = sessionStorage.getItem("accessToken");

  // 좋아요 누르면 favoriteNumber => favoriteNumber + 1
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

    //  좋아요를 누른 기록이 있으면 favorited => true
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
    //   좋아요 상태 추가
  }, []);

  // ===================================
  //   하트를 눌렀을때 발생하는 이벤트
  // ===================================
  const onClickFavorite = () => {
    // 좋아요를 이미 눌렀을 경우 : favorited => false, favoriteNumber => favoriteNumber - 1
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
            setFavoriteNumber(favoriteNumber - 1);
            setFavorited(!favorited);
            setClick(!isClick);
          } else {
            alert("favorite콜렉션에서 제거하지 못함");
          }
        });
    } else {
      // 좋아요 최초로 누를 경우 : variable 정보를 FavoritePage로 넘김.
      // 그리고 favorited => true, favoriteNumber => favoriteNumber + 1
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
    // 좋아요를 처음 누를 경우 서버에서 데이터를 받아와 Like 컬렉션에 유저,영화정보 저장
    // 그리고 likes => likes + 1 ,
    //     if (likeAction === null) {
    //       axios
    //         .post("http://localhost:5000/api/like/upLike", userCondition, {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //           },
    //         })
    //         .then((res) => {
    //           if (res.data.success) {
    //             setLikes(likes + 1);
    //             setClick(!isClick);
    //           } else {
    //             alert("좋아요 올리지 못했음");
    //           }
    //         });
    //     } else {
    //       // Like 컬렉션에 나의 정보가 있을 경우, likes => likes - 1
    //       axios
    //         .post("http://localhost:5000/api/like/unLike", userCondition, {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //           },
    //         })
    //         .then((res) => {
    //           if (res.data.success) {
    //             setLikes(likes - 1);
    //             setClick(!isClick);
    //           } else {
    //             alert("좋아요 없애지 못했음");
    //           }
    //         });
    //     }
  };
  // userCondition변수로 영화 ID를 서버로 보내고, 서버의 영화ID정보를 likes로 받아옴
  // 성공시 likes의 값을 0 => likes.length 로 변경
  //   useEffect(() => {
  //     axios
  //       .post("http://localhost:5000/api/like", userCondition, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //       .then((res) => {
  //         if (res.data.success) {
  //           setLikes(res.data.likes.length);
  //           // likes데이터에 현재 나의 ID가 존재할 경우, likeAction값을 null => liked로 변경
  //           res.data.likes.map((like) => {
  //             if (like.userId === sessionStorage.getItem("userId")) {
  //               setLikeAction("liked");
  //               //   setClick(true);
  //             }
  //           });
  //         } else {
  //           //   setClick(false);
  //           alert("Likes에 정보 수신 못함");
  //         }
  //       });
  //   }, []);

  return (
    <div>
      <div className="App">
        <Heart isClick={isClick} onClick={onClickFavorite} />
        <div className="add">
          {/* {favorited ? "Remove From Favorite" : "Add to Favorite"} */}
          people likes {favoriteNumber}
          {favorited ? "true" : "false"}
          {/* {likes} people likes {favoriteNumber} */}
        </div>
      </div>
    </div>
  );
};

export default Favorite;
