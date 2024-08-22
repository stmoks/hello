import sqlite3
import click
from flask import current_app, g
from sqlalchemy import create_engine,text
import psycopg2
import polars as pl


def init_app(app):
    app.cli.add_command(init_db_command)
    app.teardown_appcontext(close_db)

@click.command('init-db')
def init_db_command():
    db = get_db()

    with current_app.open_resource("schema.sql") as f:      
        db.execute(text(f.read().decode('utf-8')))
        

    click.echo("You successfully initialized the database!")

#todo test g session in prime
def get_db():
    if "db" not in g:
        engine = create_engine(f'postgresql+psycopg2://postgres:superuser_password@localhost:5432/dumela')
        g.db = engine.connect()

    return g.db

#TODO apply the g session to polars
def get_db_uri():
    db_conn_dict = {
    'db_name': 'dumela',
    'schema_name': 'users',
    'username': 'postgres',
    'password': 'superuser_password',
    'host': 'localhost',
    'port': 5432
}

    db_conn_uri = f"postgresql://{db_conn_dict['username']}:{db_conn_dict['password']}@{db_conn_dict['host']}:{db_conn_dict['port']}/{db_conn_dict['db_name']}"

    return db_conn_uri

#close connection
def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()
