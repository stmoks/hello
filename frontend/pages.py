from flask import Blueprint

bp = Blueprint('pages',__name__)

@bp.route('/')
def home():
    return 'Hello, home!'

@bp.route('/about')
def about():
    return 'Hello, about!'