from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize CORS with permissive configuration for debugging
    CORS(app, 
         origins="*",  # Allow all origins temporarily
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"])

    # Import and register blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app