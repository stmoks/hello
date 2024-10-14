import os
from flask import Flask

from dotenv import load_dotenv
load_dotenv()

def create_app(test_config=None):
    #create and configure the app
    application = Flask(__name__)
    application.config.from_prefixed_env()
    print(f"Database: {application.config.get('DATABASE')}")
    print(f"Environment: {os.getenv('ENVIRONMENT')}")

    # register database
    import app.database as database
    database.init_app(application)

    # register pages blueprint
    from app.views import pages
    application.register_blueprint(pages.bp)

    # register posts blueprint
    from app.views import travel
    application.register_blueprint(travel.bp)


    return application





