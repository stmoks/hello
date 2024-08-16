import sqlite3
import click
from flask import current_app, g
from sqlalchemy import create_engine
import psycopg2


def init_app(app):
    app.cli.add_command(init_db_command)
    app.teardown_appcontext(close_db)

@click.command('init-db')
def init_db_command():
    db = get_db()

    with current_app.open_resource("schema.sql") as f:
        # db.executescript(f.read().decode("utf-8"))
        db.execute(f.read().decode("utf-8"))

    click.echo("You successfully initialized the database!")

def get_db():
    if "db" not in g:
        # g.db = sqlite3.connect(
        #     current_app.config["DATABASE"],
        #     detect_types=sqlite3.PARSE_DECLTYPES,
        # )
        # g.db.row_factory = sqlite3.Row
        g.db = create_engine(f'postgresql+psycopg2://postgres:postgres@localhost:5432/users')

    return g.db

#close connection
def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        # db.close()
        db.dispose()