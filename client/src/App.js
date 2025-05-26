import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import Login from "./component/login"
import Signup from "./component/signup"
import DailyTheme from "./component/daily_theme";
import DailyProduction from "./component/daily_production";
import Evaluation from "./component/daily_evaluation";
import ProductionDetail from "./component/production_detail";
import Header from "./component/ui/header";
import './index.css';

function App() {

  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/daily_theme" element={<DailyTheme />} />
          <Route path="/daily_production" element={<DailyProduction />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/production/:id" element={<ProductionDetail />} />
        </Routes>
      </Router>
    </div>

  )
}

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = React.useState("");

  useEffect(() => {
    // ログイン状態をチェック
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    //ログイン時の名前を保存
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Welcome to My App,{" "}
          <span className="text-blue-600">{username ? username : "Guest"}さん</span>
        </h1>

        {isLoggedIn ? (
          <div>
            <p className="text-lg text-gray-600 mb-6">ようこそ！今日も頑張りましょう 💪</p>
            <Link
              to="/daily_theme"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200"
            >
              ダッシュボードへ
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-6">ログインまたは新規登録してください。</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200"
              >
                ログイン
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-200"
              >
                新規登録
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default App


