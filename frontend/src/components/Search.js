import React from "react";
import { SearchOutlined } from "@ant-design/icons";

const Search = (props) => {
  return (
    <div className="searchbox-wrap">
      <div className="searchbox-in">
        <input
          type="text"
          placeholder="영화제목은 영어로 검색하세요"
          className="searchbox"
          onChange={props.handleInput}
          onKeyPress={props.search}
          ref={props.inputRef}
        />
        <button onClick={props.handleButton}>
          <SearchOutlined className="search-icon" />
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
