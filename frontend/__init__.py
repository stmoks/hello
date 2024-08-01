import os
from flask import Flask


def create_app(test_config=None):
    #create and configure the app
    app = Flask(__name__)

    @app.route('/')
    def hello():
        return 'Hello,world!'
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(port=8000,debug=True)

