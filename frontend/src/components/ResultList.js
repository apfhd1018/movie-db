import React from "react";
import { Row, Col } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";

//====================================
// Popup 열때마다 재렌더링
//====================================

const Result = ({
  result,
  openPopup,
  setToggle,
  setClick,
  isClick,
  movieId,
}) => {
  const variable = {
    userFrom: sessionStorage.getItem("userId"),
    movieId: movieId,
  };
  const accessToken = sessionStorage.getItem("accessToken");

  //검색후 나오는 영화를 눌렀을때 발생하는 이벤트
  const popupToggle = () => {
    openPopup(result.imdbID); // 데이터 가져온다
    setToggle(true); //토글 true로 팝업창 띄운다
    fetchLikeData(); //데이터 유무에 따라 하트 변화
  };
  // 영화검색후 나온 포스터 누를 때 API 요청
  const fetchLikeData = () => {
    axios
      .post("http://localhost:5000/api/private/getLike", variable, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setClick(res.data.likeData); // 데이터 있으면 하트 On 없으면 하트Off
          console.log("하트 ", res.data.success);
        } else {
          console.log("하트데이터 못불러옴");
        }
      });
  };

  return (
    <Col lg={8} md={12} xs={12} className="result">
      <div onClick={popupToggle}>
        <img src={result.Poster} alt="poster" />
      </div>
      <div className="result-text">
        <h3>{result.Title}</h3>
      </div>
    </Col>
  );
};

function ResultList(props) {
  if (props.results[0] === 1) {
    return (
      <div className="no-result">
        <SyncOutlined spin /> <br />
        No results were found for your search.
        <br />
        Please <span style={{ color: "#ff9800" }}>check the words.</span>
      </div>
    );
  } else
    return (
      <div className="resultlist-container">
        <div className="resultlist">
          <Row>
            {props.results.map((result) => {
              return (
                <Result
                  result={result}
                  key={result.imdbID}
                  openPopup={props.openPopup}
                  toggle={props.toggle}
                  setToggle={props.setToggle}
                  setClick={props.setClick}
                  isClick={props.isClick}
                  movieId={result.imdbID}
                />
              );
            })}
          </Row>
        </div>
      </div>
    );
}

export default ResultList;
