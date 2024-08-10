import os
from flask import Flask

# from dotenv import load_dotenv
# load_dotenv()

def create_app(test_config=None):
    #create and configure the app
    application = Flask(__name__)
    # application.config.from_prefixed_env()
    # print(application.config.get('DATABASE'))
    # print(os.getenv('ENVIRONMENT'))


    # import pages blueprint
    from app.views import pages
    application.register_blueprint(pages.bp)

    # register posts blueprint
    from app.views import posts
    application.register_blueprint(posts.bp)

    return application





