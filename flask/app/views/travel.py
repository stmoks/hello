from sqlalchemy import text
from flask import Blueprint,redirect,render_template,request,url_for
import folium

bp = Blueprint('travel',__name__)

from app.database import get_db


@bp.route('/posts',methods=['GET'])
def options():
    db = get_db()
    posts = db.execute(
        text('SELECT author, message, created FROM users.post ORDER BY created DESC')
    ).fetchall()
    return render_template('travel/options.html',posts=posts)


