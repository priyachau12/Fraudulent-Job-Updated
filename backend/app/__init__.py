from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize CORS with proper configuration
    CORS(app, 
         origins=[
             "http://localhost:5173",  # local development
             "https://fraudulent-job-updated-1.onrender.com"  # deployed frontend
         ],
         supports_credentials=True)

    # Import and register blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app