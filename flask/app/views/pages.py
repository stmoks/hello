import folium
from flask import Blueprint,render_template,render_template_string

bp = Blueprint('pages',__name__)

@bp.route('/')
def home():
    m = folium.Map(location=[39.949610, -75.150282], zoom_start=16)
    folium.Marker(
        [39.949610, -75.150282], popup='Liberty Bell', tooltip='Liberty Bell'
    ).add_to(m)
    m.save('app/templates/pages/map.html')

    return render_template('pages/home.html')

