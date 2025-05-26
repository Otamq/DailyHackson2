import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const navStyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "black",
    fontWeight: "bold"
  };

  const activeStyle = {
    color: "blue"
  };

  return (
    <header style={{ backgroundColor: "#f8f8f8", padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/" style={navStyle} activeStyle={activeStyle} end>
        ホーム
      </NavLink>
      <NavLink to="/login" style={navStyle} activeStyle={activeStyle}>
        ログイン
      </NavLink>
      <NavLink to="/daily_theme" style={navStyle} activeStyle={activeStyle}>
        テーマ一覧
      </NavLink>
      <NavLink to="/daily_production" style={navStyle} activeStyle={activeStyle}>
        作品提出
      </NavLink>
      <NavLink to="/evaluation" style={navStyle} activeStyle={activeStyle}>
        作品一覧
      </NavLink>
    </header>
  );
};

export default Header;
