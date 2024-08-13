from flask import Blueprint,redirect,render_template,request,url_for

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
                "INSERT INTO post (author, message) VALUES (?, ?)",
                (author, message),
            )
            db.commit()
            return redirect(url_for("posts.posts"))
    return render_template('posts/explore.html')

@bp.route('/posts')
def posts():
    posts = []
    return render_template('posts/posts.html',posts=posts)
