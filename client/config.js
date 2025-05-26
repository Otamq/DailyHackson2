// src/config.js

// 本番環境・開発環境で切り替える場合
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

export default {
  BACKEND_URL,
};
