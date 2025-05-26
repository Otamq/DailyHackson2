from flask import Blueprint, jsonify, request
from sqlalchemy import func
from model import DailyTheme, Production
from database import db
from datetime import datetime, timedelta


production_bp = Blueprint("production", __name__)

@production_bp.route("/show_daily_theme", methods=["GET"])
def show_daily_theme():
    now = datetime.now()

    if now.hour < 6:
        # 朝6時前なら、前日の6時から今日の6時までを対象とする
        start = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = now.replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # 朝6時以降なら、今日の6時から明日の6時までを対象とする
        start = now.replace(hour=6, minute=0, second=0, microsecond=0)
        end = (now + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        
    daily_theme = db.session.query(DailyTheme).filter(DailyTheme.created_at >= start, DailyTheme.created_at < end).first()
    
    return jsonify({"theme":daily_theme.theme})

@production_bp.route("/upload", methods=["POST"])
def production_upload():
    file = request.files["file"]
    filename = request.form["filename"]
    description = request.form["description"]
    username = request.form["username"]
    content = file.read()
    
    now = datetime.now()
    if now.hour < 6:
        # 朝6時前なら、前日の6時から今日の6時までを対象とする
        start = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = now.replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # 朝6時以降なら、今日の6時から明日の6時までを対象とする
        start = now.replace(hour=6, minute=0, second=0, microsecond=0)
        end = (now + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
    
    #ユーザによってすでに一つ投稿されていれば更新する
    existed_user = db.session.query(Production).filter(username == username, Production.created_at >= start, Production.created_at < end).first()
    if existed_user:
        try:
            existed_user.file = file
            existed_user.filename = filename
            existed_user.description = description
            content_utf8 = content.decode("utf-8")
            return jsonify({"message": "Update Production", "code":content_utf8})
        except:
            db.session.rollback()
            
    try:
        production = Production(file=content, filename=filename, description=description, username=username)
        db.session.add(production)
        db.session.commit()
        content_utf8 = content.decode("utf-8")
        return jsonify({"message": "Register Production", "code":content_utf8})
    except:
        db.session.rollback()
        
    return jsonify({"message":"失敗"})