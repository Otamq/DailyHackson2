from flask import Flask, request, jsonify, flash, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_user, logout_user, login_required
from model import User
from werkzeug.security import generate_password_hash, check_password_hash
from database import db

login_bp = Blueprint("login",__name__)

@login_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["name"]
    password = data["password"]
    
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message":'そのユーザー名は既に使用されています'}), 409

        
    try:
        user = User(username=username, password=generate_password_hash(password, method='pbkdf2:sha256'))
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "登録完了しました"})
    except Exception as e:
        db.session.rollback()
        #print('エラーが発生しました。もう一度お試しください')
        return jsonify({"message": "サーバーエラー", "error": str(e)}), 500

    return jsonify({"message": "データを受け取りました"})

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    #print("Received data:", data)
    
    username = data["username"]
    password = data["password"]
        
    user = User.query.filter_by(username = username).first()
        
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message":"ログイン失敗"}), 403
        
    if check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message":"ログイン成功", "isLogin":1, "username":user.username}), 200
    
@login_bp.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message":"ログアウトしました","isLogin":0})
        
    
    