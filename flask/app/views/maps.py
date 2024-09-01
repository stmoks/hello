from flask import render_template,Blueprint
import polars as pl
from app.database import get_db_uri
import folium


bp = Blueprint('maps',__name__)

@bp.route('/explore_map')
def explore_map():
    db_uri = get_db_uri()

    # map base
    map = folium.Map(location=[39.949610, -75.150282], zoom_start=16)
    folium.Marker(
        [39.949610, -75.150282], popup='Liberty Bell', tooltip='Liberty Bell'
    ).add_to(map)

    country_info = pl.read_database_uri('SELECT * FROM reference.country_info', db_uri)

    country_info.with_columns(pl.col('coords_city_sdc').map_elements(lambda x: folium.CircleMarker(location=x.split(',')[0:2], radius=2, fill=True, popup=country_info.filter(pl.col('city') == x.split(',')[2]).select(pl.col(['country', 'city']))._repr_html_()).add_to(map)))

    map_html = map._repr_html_()
     
    return render_template('maps/map.html',map_html=map_html)