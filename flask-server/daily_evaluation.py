from flask import Blueprint, jsonify, request
from database import db
from sqlalchemy import func
from model import DailyTheme, Production
from datetime import datetime, timedelta


evaluation_bp = Blueprint("evaluation", __name__)

@evaluation_bp.route("/show_daily_production_theme", methods=["GET"])
def show_daily_production_theme():
    now = datetime.now()
    
    if now.hour < 6:
        # 朝6時前なら、前前日の6時から前日の6時までを対象とする
        start = (now - timedelta(days=2)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # 朝6時以降なら、前日の6時から本日の6時までを対象とする
        start = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = now.replace(hour=6, minute=0, second=0, microsecond=0)
        
    daily_theme = db.session.query(DailyTheme).filter_by(DailyTheme.created_at >= start, DailyTheme.created_at <= end).first()
    
    return jsonify({"theme": daily_theme.theme})

@evaluation_bp.route("/show_daily_production_all", methods=["GET"])
def show_daily_production_all():
    now = datetime.now()

    if now.hour < 6:
        # 朝6時前なら、前前日の6時から前日の6時までを対象とする
        start = (now - timedelta(days=2)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
    else:
        # 朝6時以降なら、前日の6時から本日の6時までを対象とする
        start = (now - timedelta(days=1)).replace(hour=6, minute=0, second=0, microsecond=0)
        end = now.replace(hour=6, minute=0, second=0, microsecond=0)
        
    daily_productions = db.session.query(Production).filter(Production.created_at >= start, Production.created_at < end).all()
    
    return jsonify([{"id":daily_production.id, "filename":daily_production.filename, "description":daily_production.description}
                    for daily_production in daily_productions])
    
@evaluation_bp.route("/production/<int:id>", methods=["GET"])
def productions(id):
    production = db.session.query(Production).filter(Production.id == id).first()
    content_utf8 = production.file.decode("utf-8")
    
    return jsonify({"filename":production.filename, "description":production.description, "code":content_utf8})

    
    
    
    
    
    