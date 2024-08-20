from sqlalchemy import text
from flask import Blueprint,redirect,render_template,request,url_for
import folium
import streamlit
from streamlit_folium import st_folium


bp = Blueprint('posts',__name__)

from app.database import get_db

@bp.route('/explore',methods=['GET','POST'])
def search():
    if request.method == "POST":
        author = request.form["author"] or "Anonymous"
        message = request.form["message"]

        if message:
            db = get_db()
            db.execute(
                text("INSERT INTO users.post (author, message) VALUES (:a, :m)"),
                {'a': author, 'm':message}
            )
            db.commit()
            return redirect(url_for("posts.posts"))
    return render_template('posts/explore.html')

@bp.route('/posts',methods=['GET'])
def posts():
    db = get_db()
    posts = db.execute(
        text('SELECT author, message, created FROM users.post ORDER BY created DESC')
    ).fetchall()
    return render_template('posts/posts.html',posts=posts)


@bp.route('/map',methods=['GET'])
def map():
     # m.get_root().render()
    return render_template('pages/map.html')
    
    
