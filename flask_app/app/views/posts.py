from flask import render_template,Blueprint

bp = Blueprint('posts',__name__)


@bp.route('/explore')
def search():
    return render_template('posts/explore.html')