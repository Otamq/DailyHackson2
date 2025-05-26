import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/Form.css";

function Signup() {
  const [formData, setFormData] = useState({ name: "",  password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response:", data);
      alert(data.message)
      if (data.message === "データを受け取りました") { navigate("/login"); }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">ユーザー登録</h2>
      <hr />

      <div>
        <label className="block text-gray-700 font-medium mb-1">ユーザー名</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="例: yamada_taro"
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
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          登録
        </button>
      </div>
    </form>

  )
}

export default Signup