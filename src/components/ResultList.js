import React from "react";
import { Row, Col } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const Result = ({ result, openPopup, setToggle }) => {
  return (
    <Col lg={8} md={12} xs={24} className="result">
      <div
        onClick={() => {
          openPopup(result.imdbID);
          setToggle(true);
        }}
      >
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
                />
              );
            })}
          </Row>
        </div>
      </div>
    );
}

export default ResultList;
