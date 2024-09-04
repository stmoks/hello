from sqlalchemy import text
from flask import Blueprint,redirect,render_template,request,url_for
import folium

bp = Blueprint('posts',__name__)

from app.database import get_db


@bp.route('/posts',methods=['GET'])
def posts():
    db = get_db()
    posts = db.execute(
        text('SELECT author, message, created FROM users.post ORDER BY created DESC')
    ).fetchall()
    return render_template('posts/posts.html',posts=posts)


    
    
