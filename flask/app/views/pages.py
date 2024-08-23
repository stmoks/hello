import folium
from flask import Blueprint,render_template,render_template_string
from sqlalchemy import text
import polars as pl

bp = Blueprint('pages',__name__)

from app.database import get_db,get_db_uri

#TODO show the flags on the popup 

@bp.route('/')
def home():
    db = get_db_uri()

    # map base
    m = folium.Map(location=[39.949610, -75.150282], zoom_start=16)
    folium.Marker(
        [39.949610, -75.150282], popup='Liberty Bell', tooltip='Liberty Bell'
    ).add_to(m)

    country_info = pl.read_database_uri('SELECT * FROM reference.country_info',db)
    country_info.with_columns(pl.col('coords_city_sdc').map_elements(lambda x: folium.CircleMarker(location = x.split(',')[0:2], radius=2,
    fill=True,
    popup=country_info.filter(pl.col('city')== x.split(',')[2]).select(pl.col(['country','city']))._repr_html_()).add_to(m)))
    
    m.save('app/templates/pages/map.html')

    return render_template('pages/index.html')

