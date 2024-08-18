import folium
from flask import Blueprint,render_template,render_template_string

bp = Blueprint('pages',__name__)

@bp.route('/')
def home():
    m = folium.Map()
    m.get_root().width = "800px"
    m.get_root().height = "600px"
    iframe = m.get_root()._repr_html_()
    return render_template('pages/home.html',iframe=iframe)

