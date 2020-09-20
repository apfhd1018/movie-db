import React, { useState, useRef } from "react";
import "./App.css";
import Search from "./components/Search";
import axios from "axios";
import ResultList from "./components/ResultList";
import Popup from "./components/Popup";
import Login from "./components/Login";
import Register from "./components/Register";
import FavoritePage from "./components/FavoritePage";

function App() {
  const [moviedb, setMoviedb] = useState({
    title: "",
    results: [],
    selected: {},
  });
  // popup창 토글
  const [toggle, setToggle] = useState(false);
  // login Display 띄우기
  const [login, setLogin] = useState(false);
  // register Display 띄우기
  const [register, setRegister] = useState(false);
  // favorite Display 띄우기
  const [favorite, setFavorite] = useState(false);
  // 로그인 => 로그아웃 글자 변경
  const [change, setChange] = useState(true);
  // 좋아요 하트버튼 On/oFF
  const [isClick, setClick] = useState(false);

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
    axios.get(apiURL + "&s=" + moviedb.title).then(({ data }) => {
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
    axios.get(apiURL + "&i=" + id).then(({ data }) => {
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
    setLogin(true);
  };
  // 회원가입 화면 열기
  const openRegister = () => {
    setLogin(false);
    setRegister(true);
  };
  //====================================
  // 로그인 이후 private 접근 경로 설정
  //====================================
  const openFavorite = async () => {
    try {
      // 세션스토리지에 담긴 accessToken을 찾는다
      const accessToken = sessionStorage.getItem("accessToken");

      // access token을 헤더에 담아서 private경로 요청
      const res = await axios.get("http://localhost:5000/api/private", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("favorite 모달 : ", res);
      // 에러발생안하면 Favorite리스트 열고 닫기 가능
      setFavorite(!favorite);
    } catch (err) {
      alert("Please Log in!");
      // console.log("토큰갱신에러", err);
      // 세션스토리지에 담긴 refreshToken을 찾는다
      const refreshToken = sessionStorage.getItem("refreshToken");
      // private경로 요청 에러시, users/token 경로로 refresh token을 담아서 요청
      const res = await axios.post("http://localhost:5000/api/users/token", {
        token: refreshToken,
      });
      // console.log("재요청 : ", res);
      // 요청통해 전달받은 accessToken을 새로운 accessToken으로 선언
      const accessToken = res.data.accessToken;
      // 세션스토리지에 저장
      sessionStorage.setItem("accessToken", accessToken);
      // private경로 재요청
      await axios.get("http://localhost:5000/api/private", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  };
  //====================================
  // 로그아웃 요청
  //====================================
  const logout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    try {
      const res = await axios.delete("http://localhost:5000/api/users/logout", {
        token: refreshToken,
      });
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("userId");
      setChange(true);
      console.log("로그아웃 res : ", res);
    } catch (err) {
      console.log("로그아웃 에러", err);
    }
  };

  return (
    <div className="moviedb">
      {login === true ? (
        <Login
          login={login}
          setLogin={setLogin}
          openRegister={openRegister}
          setRegister={setRegister}
          setChange={setChange}
        />
      ) : null}

      {register === true ? (
        <Register setRegister={setRegister} setLogin={setLogin} />
      ) : null}
      <header>
        <div className="nav">
          {/* 로그인시 글자 바뀜 */}
          {change === true ? (
            <span onClick={openLogin}>Sign-In</span>
          ) : (
            <span onClick={logout}>Log-Out</span>
          )}
          {/* <span onClick={openLogin}>Sign-In</span>
          <span>Log-Out</span> */}

          <span onClick={openFavorite}>My Favorite List</span>
        </div>
      </header>

      <div className="page-title">
        <h1 onClick={screenReset}>Movie Database</h1>
      </div>
      {favorite === true ? <FavoritePage /> : null}

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
        setClick={setClick}
        isClick={isClick}
      />
      {toggle === true ? (
        <Popup
          results={moviedb.selected}
          closePopup={closePopup}
          setClick={setClick}
          isClick={isClick}
        />
      ) : null}
    </div>
  );
}

export default App;
