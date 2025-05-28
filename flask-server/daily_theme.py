from flask import Flask, request, jsonify, flash, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, desc
from flask_login import login_user, logout_user, login_required
from model import User, Theme, Good, DailyTheme
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from flask_apscheduler import APScheduler
from scheduler import scheduler
from app import app
from datetime import datetime, timedelta

theme_bp = Blueprint("theme", __name__)


@theme_bp.route("/theme", methods=["POST"])
def register_Theme():
    data = request.json
    now = datetime.now()
    
    if now.hour < 6:
        # 朝6時前なら、前日の6時から今日の6時までを対象とする
        start = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = now.replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # 朝6時以降なら、今日の6時から明日の6時までを対象とする
        start = now.replace(hour=6, minute=0, second=0, microsecond=0)
        end = (now + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)

    theme = data["theme"]
    description = data["description"]
    username = data["username"]
    
    existed_user = db.session.query(Theme).filter(Theme.username == username, Theme.created_at >= start, Theme.created_at < end).first()
    if existed_user:
        return jsonify({"message": "user is already posted"})

    try:
        theme = Theme(username=username, theme=theme, description=description)
        db.session.add(theme)
        db.session.commit()
        return jsonify({"message": "Register Theme"})
    except:
        db.session.rollback()

    return jsonify({"message": "do not register"})


@theme_bp.route("/theme_all", methods=["GET"])
def show_theme_all():
    now = datetime.now()
    
    if now.hour < 6:
        # 朝6時前なら、前日の6時から今日の6時までを対象とする
        start = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = now.replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # 朝6時以降なら、今日の6時から明日の6時までを対象とする
        start = now.replace(hour=6, minute=0, second=0, microsecond=0)
        end = (now + timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        
    themes = db.session.query(Theme).filter(Theme.created_at >= start, Theme.created_at < end).all()
    return jsonify(
        [
            {"id": theme.id, "theme": theme.theme, "description": theme.description}
            for theme in themes
        ]
    )


@theme_bp.route("/good_all", methods=["GET"])
def show_good_all():
    result = (
        db.session.query(Good.theme_id, func.count(Good.id))
        .group_by(Good.theme_id)
        .all()
    )

    # 結果を辞書に変換
    good_count_dict = {theme_id: count for theme_id, count in result}
    return jsonify(good_count_dict)

#一テーマにつき一回までgoodを押せるようにする
@theme_bp.route("/good", methods=["GET"])
def count_good():
    username = request.args.get("username")
    theme = request.args.get("theme")
    # username（ユーザー名）から User インスタンスを取得
    user_obj = User.query.filter_by(username=username).first()
    # theme（テーマのタイトル）から Theme インスタンスを取得
    theme_obj = Theme.query.filter_by(id=theme).first()

    exisiting_good = Good.query.filter_by(
        user_id=user_obj.id, theme_id=theme_obj.id
    ).first()
    if exisiting_good:
        db.session.delete(exisiting_good)
        db.session.commit()
        print(f"delete {exisiting_good}")
    else:
        try:
            good = Good(user=user_obj, theme=theme_obj)
            db.session.add(good)
            db.session.commit()
        except:
            db.session.rollback()
            #print("エラーが発生しました")

    goods = db.session.query(Good).filter_by(theme_id=theme_obj.id).count()

    return jsonify({"good": goods})


def decide_daily_theme():
    goods = (
        db.session.query(Good.theme_id, func.count(Good.id).label("count"))
        .select_from(Good)
        .group_by(Good.theme_id)
        .order_by(desc("count"))
        .all()
    )

    most_good_theme = goods[0][0] if goods else None

    return most_good_theme


#毎日6時に最もいいねの多いテーマを登録する
@scheduler.task("cron", id="do_job_1", hour=6, misfire_grace_time=900)
#@scheduler.task("interval", id = "do_job_2", minutes = 1) #デバッグ用
def resister_daily_theme():
    with app.app_context():
        most_good_id = decide_daily_theme()
        most_good_theme_row = db.session.query(Theme.theme).filter_by(id = most_good_id).first()
        most_good_theme_str = most_good_theme_row[0]
        
        if most_good_theme_str:
            daily_theme = DailyTheme(theme = most_good_theme_str)
            db.session.add(daily_theme)
            db.session.commit()
        else:
            daily_theme = DailyTheme(theme = "None")
            db.session.add(daily_theme)
            db.session.commit()
    
    return "登録しました"
