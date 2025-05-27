from database import db
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import LargeBinary

class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30),nullable=False, unique=True)
    password = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    
    # Flask-Login の login_user() に必要な属性を定義
    @property
    def is_active(self):
        return True  # ユーザーを常に有効とする

    @property
    def is_authenticated(self):
        return True  # ログイン状態を表す

    @property
    def is_anonymous(self):
        return False  # 匿名ユーザーではない

    def get_id(self):
        return str(self.id) #ユーザーIDを返す
    
    def __repr__(self):
        return f"<User {self.username}>"
    
class Theme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False)
    theme = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    
class Good(db.Model):
    __tablename__ = 'goods'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    theme_id = db.Column(db.Integer,db.ForeignKey('theme.id'),nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    
    user = db.relationship('User', backref=db.backref('goods',lazy=True))
    theme = db.relationship('Theme', backref=db.backref('goods',lazy=True))
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'theme_id', name='uix_user_theme'),
    )
    
class DailyTheme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable = False, default=datetime.now)
    
class Production(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file = db.Column(db.LargeBinary, nullable=False)
    filename = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    