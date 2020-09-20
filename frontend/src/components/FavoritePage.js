import React, { useEffect, useState } from "react";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const FavoritePage = () => {
  const variable = { userFrom: sessionStorage.getItem("userId") };
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    // 렌더링 될때마다 movie list 업데이트함
    fetchFavoriteMovie();
  }, []);

  const fetchFavoriteMovie = () => {
    // variable변수통해 userFrom에 대한 데이터를 favorites 로 가져옴
    // favoriteMovies 배열에 데이터 넣음
    axios
      .post("http://localhost:5000/api/private/getFavoriteMovie", variable, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFavoriteMovies(res.data.favorites);
        } else {
          console.log("Failed to get favorited videos");
        }
      });
  };

  const onClickRemove = (movieId) => {
    const variable = {
      movieId: movieId,
      userFrom: sessionStorage.getItem("userId"),
    };

    axios
      .post("http://localhost:5000/api/private/removeFromFavorite", variable, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          fetchFavoriteMovie();
          console.log("삭제성공");
        } else {
          console.log("favorite콜렉션에서 제거하지 못함");
        }
      });
  };

  return (
    <div className="favorite">
      {favoriteMovies.map((movie, index) => {
        return (
          <div>
            <div className="favorite-box">
              <img src={movie.moviePoster} alt="" />
              {movie.movieTitle}
              <div className="favorite-icon">
                <Tooltip title="Delete">
                  <Button
                    shape="circle"
                    icon={
                      <DeleteOutlined
                        onClick={() => onClickRemove(movie.movieId)}
                      />
                    }
                    danger
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FavoritePage;
