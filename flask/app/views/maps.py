from flask import render_template,Blueprint
import polars as pl
from app.database import get_db_uri
import folium


bp = Blueprint('maps',__name__)

@bp.route('/explore_map')
def explore_map():
    db_uri = get_db_uri()

    # map base
    map = folium.Map(location=[39.949610, -75.150282], zoom_start=5)
    folium.Marker(
        [39.949610, -75.150282], popup='Liberty Bell', tooltip='Liberty Bell'
    ).add_to(map)

    map_html = map._repr_html_()
     
    return render_template('maps/map.html',map_html=map_html)