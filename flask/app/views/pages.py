from app.database import get_db, get_db_uri
import folium
from flask import Blueprint, render_template, request
import polars as pl

bp = Blueprint('pages', __name__)


# TODO show the flags on the popup

@bp.route('/', methods=['GET', 'POST'])
def home():
    db_uri = get_db_uri()
    country_info = pl.read_database_uri('SELECT * FROM reference.country_info', db_uri)
    # capitals dropdown list
    capitals = country_info.select(pl.col('city').sort()).to_series().to_list()
    return render_template('pages/index.html',capitals=capitals)



@bp.route('/submit-capital', methods=['POST'])
def submit_capital():
    db_uri = get_db_uri()

    country_info = pl.read_database_uri('SELECT * FROM reference.country_info', db_uri)

    country_info = pl.read_database_uri(f"SELECT city,country,longitude_sdc,latitude_sdc FROM reference. country_info", db_uri)

    capitals = country_info.select(pl.col('city').sort()).to_series().to_list()

    # search for the country coordinates
   
    if request.method == 'POST':
        city = request.form.get('capital_options')
        try:
            country = country_info.filter(pl.col('city') == city ).select(['country','longitude_sdc','latitude_sdc']).item(0,0)
        except:
            country = ''
    else:
        country = ''

    return country


    