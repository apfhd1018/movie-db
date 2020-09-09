import React, { useState, useRef } from "react";
import "./App.css";
import Search from "./components/Search";
import Axios from "axios";
import ResultList from "./components/ResultList";
import Popup from "./components/Popup";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [moviedb, setMoviedb] = useState({
    title: "",
    results: [],
    selected: {},
  });
  // popup창 토글
  const [toggle, setToggle] = useState(false);
  // login Display 속성 변경
  const [login, setLogin] = useState("none");
  // register Display 띄우기
  const [register, setRegister] = useState(false);

  // search 검색창 포커스
  const inputRef = useRef();

  const apiURL = "http://www.omdbapi.com/?apikey=ec6e8a00";

  // 검색하는 영화제목 담기
  const handleInput = (e) => {
    const typedTitle = e.target.value;

    setMoviedb((prevState) => {
      return { ...prevState, title: typedTitle };
    });
  };
  // 엔터 누른 후 state에 API 저장하기
  const search = (e) => {
    // if (e.key === "Enter") {
    Axios.get(apiURL + "&s=" + moviedb.title).then(({ data }) => {
      const searchResults = data.Search || [1];
      // 받아온 Search 데이터가 없을경우 [1]을 할당

      setMoviedb((prevState) => {
        return { ...prevState, results: searchResults };
      });
    });
    // }
  };

  // Result를 누를 시 ID기반 정보 API moviedb에 저장
  const openPopup = (id) => {
    Axios.get(apiURL + "&i=" + id).then(({ data }) => {
      const popupResult = data;

      setMoviedb((prevState) => {
        return { ...prevState, selected: popupResult };
      });
    });
    console.log(moviedb.selected);
  };
  const closePopup = () => {
    setMoviedb((prevState) => {
      return { ...prevState, selected: {} };
    });
    setToggle(false);
  };
  // 메인 타이틀 텍스트 누르면 화면 리셋 후 input에 포커싱
  const screenReset = () => {
    setMoviedb({
      title: "",
      results: [],
      selected: {},
    });
    inputRef.current.focus();
    inputRef.current.value = "";
  };
  // 로그인 화면 열기
  const openLogin = () => {
    setLogin("block");
  };
  // 회원가입 화면 열기
  const openRegister = () => {
    setLogin("none");
    setRegister(true);
  };

  return (
    <div className="moviedb">
      <Login
        login={login}
        setLogin={setLogin}
        openRegister={openRegister}
        setRegister={setRegister}
      />
      {register === true ? (
        <Register setRegister={setRegister} setLogin={setLogin} />
      ) : null}
      <header>
        <div className="nav">
          <span onClick={openLogin}>Sign-In</span>
          <span>My Favorite List</span>
        </div>
      </header>

      <div className="page-title">
        <h1 onClick={screenReset}>Movie Database</h1>
      </div>
      <Search
        handleInput={handleInput}
        search={(e) => {
          if (e.key === "Enter") {
            search();
          }
        }}
        handleButton={search}
        inputRef={inputRef}
      />
      <ResultList
        results={moviedb.results}
        openPopup={openPopup}
        toggle={toggle}
        setToggle={setToggle}
      />
      {toggle === true ? (
        <Popup results={moviedb.selected} closePopup={closePopup} />
      ) : null}
    </div>
  );
}

export default App;
