import React from "react";
import { Button } from "antd";
import Favorite from "./Section/Favorite";

function Popup({ results, closePopup, setClick, isClick }) {
  return (
    <div className="popup">
      <div className="btn-position">
        <h2>
          {results.Title} ({results.Year})
        </h2>
        <div style={{ display: "flex", position: "relative" }}>
          <div>
            <p className="rating">Rating : {results.imdbRating}</p>
          </div>
          <Favorite
            userFrom={sessionStorage.getItem("userId")}
            movieId={results.imdbID}
            movieTitle={results.Title}
            moviePoster={results.Poster}
            setClick={setClick}
            isClick={isClick}
          />
        </div>
        <div className="poster">
          <img src={results.Poster} alt="" />
          <div className="poster-right">
            <p>
              <span>PLOT</span> <br />
              {results.Plot}
            </p>
            <p>
              <span>DIRECTOR</span> <br />
              {results.Director}
            </p>
            <p>
              <span>ACTOR</span> <br />
              {results.Actors}
            </p>
          </div>
        </div>
        <div className="close-popup">
          <Button type="primary" onClick={closePopup}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
