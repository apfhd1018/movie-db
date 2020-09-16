import React, { useEffect, useState } from "react";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const FavoritePage = () => {
  const variable = { userFrom: sessionStorage.getItem("userId") };
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    fetchFavoriteMovie();
  }, []);

  const fetchFavoriteMovie = () => {
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
          alert("Failed to get favorited videos");
        }
      });
  };

  const onClickRemove = (movieId) => {
    const variable = {
      movieId: movieId,
      userId: sessionStorage.getItem("userId"),
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
        } else {
          alert("favorite콜렉션에서 제거하지 못함");
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
