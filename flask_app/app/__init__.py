import os
from flask import Flask


def create_app(test_config=None):
    #create and configure the app
    application = Flask(__name__)

    # import pages blueprint
    from app.views import pages
    application.register_blueprint(pages.bp)

    return application




