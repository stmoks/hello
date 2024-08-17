import sqlite3
import click
from flask import current_app, g
from sqlalchemy import create_engine
from sqlalchemy.sql import text
import psycopg2


def init_app(app):
    app.cli.add_command(init_db_command)
    app.teardown_appcontext(close_db)

@click.command('init-db')
def init_db_command():
    db = get_db()

    with current_app.open_resource("schema.sql") as f:      
        db.execute(text(f.read().decode('utf-8')))
        

    click.echo("You successfully initialized the database!")

def get_db():
    if "db" not in g:
        engine = create_engine(f'postgresql+psycopg2://postgres:superuser_password@localhost:5432/dumela')
        g.db = engine.connect()

    return g.db

#close connection
def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()
