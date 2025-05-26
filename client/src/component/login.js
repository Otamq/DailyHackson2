import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../css/Form.css";
import config from "../config";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response:", data);

      if (response.ok && data.isLogin === 1) {
        console.log("ログイン成功")
        localStorage.setItem("isLoggedIn", "true"); // ログイン状態を保存
        localStorage.setItem("username", data.username);
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">ログイン</h2>
          <hr />

          <div>
            <label className="block text-gray-700 font-medium mb-1">ユーザー名</label>
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="yamada_taro"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">パスワード</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="パスワードを入力"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            ログイン
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            アカウントを持っていない方はこちら
          </Link>
        </div>
      </div>
    </div>

  )
}

export default Login