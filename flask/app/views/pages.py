import folium
from flask import Blueprint,render_template,render_template_string

bp = Blueprint('pages',__name__)

@bp.route('/')
def home():
    return render_template('pages/home.html')

