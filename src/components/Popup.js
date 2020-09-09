import React, { useState } from "react";
import { Button } from "antd";
import Heart from "react-animated-heart";

function Popup({ results, closePopup }) {
  const [isClick, setClick] = useState(false);

  return (
    <div className="popup">
      <div className="btn-position">
        <h2>
          {results.Title} ({results.Year})
        </h2>
        <p className="rating">Rating : {results.imdbRating}</p>
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
            <div>
              <div className="App">
                <Heart isClick={isClick} onClick={() => setClick(!isClick)} />
                <div className="add">Add My Favorite!</div>
              </div>
            </div>
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
