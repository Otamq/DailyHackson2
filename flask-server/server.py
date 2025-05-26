from flask import Flask, request, jsonify, flash
from flask_cors import CORS
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config  
from database import db
from scheduler import scheduler
import os
from app import app


app.config.from_object(Config)
CORS(app)

login_manager = LoginManager()

db.init_app(app)
login_manager.init_app(app)


from login import login_bp
from daily_theme import theme_bp
from daily_production import production_bp
from daily_evaluation import evaluation_bp
app.register_blueprint(login_bp)
app.register_blueprint(theme_bp)
app.register_blueprint(production_bp)
app.register_blueprint(evaluation_bp)


# if you don't wanna use a config, you can set options here:
# scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()


@app.route("/members")
def members():
    return{"members":["Member1","Member2","Member3"]}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=10000)
    
    
