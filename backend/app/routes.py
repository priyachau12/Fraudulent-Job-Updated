from flask import Blueprint, request, jsonify, make_response
from app.scraper import JobScraper
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from pymongo import MongoClient

main = Blueprint('main', __name__)
scraper = JobScraper()

# MongoDB connection
client = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017/'))
db = client.fraudulent_job_db
users_collection = db.users

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')

@main.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Backend is running',
        'timestamp': datetime.utcnow().isoformat()
    })

def create_token(user):
    payload = {
        'id': str(user['_id']),
        'email': user['email'],
        'isAdmin': user.get('isAdmin', False),
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def auth_middleware(f):
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'message': 'Not authenticated'}), 401
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.user = payload
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
    
    decorated_function.__name__ = f.__name__
    return decorated_function

def admin_middleware(f):
    def decorated_function(*args, **kwargs):
        if not request.user.get('isAdmin'):
            return jsonify({'message': 'Admin only'}), 403
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

@main.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirmPassword = data.get('confirmPassword')
    
    if not all([name, email, password, confirmPassword]):
        return jsonify({'message': 'All fields required'}), 400
    
    if password != confirmPassword:
        return jsonify({'message': 'Passwords do not match'}), 400
    
    # Check if user already exists
    existing_user = users_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 400
    
    # Hash password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user = {
        'name': name,
        'email': email,
        'passwordHash': password_hash,
        'isAdmin': False,
        'createdAt': datetime.utcnow()
    }
    
    result = users_collection.insert_one(user)
    
    return jsonify({'message': 'User registered successfully'}), 201

@main.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    isAdminLogin = data.get('isAdminLogin', False)
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    # Find user
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 400
    
    # Check password
    if not bcrypt.checkpw(password.encode('utf-8'), user['passwordHash']):
        return jsonify({'message': 'Invalid credentials'}), 400
    
    # Check admin access
    if isAdminLogin and not user.get('isAdmin'):
        return jsonify({'message': 'Not an admin account'}), 403
    
    # Create token
    token = create_token(user)
    
    # Create response
    response = make_response(jsonify({
        'user': {
            'email': user['email'],
            'isAdmin': user.get('isAdmin', False)
        }
    }))
    
    # Set cookie
    response.set_cookie(
        'token',
        token,
        httponly=True,
        samesite='Lax',
        secure=False,  # Set to True in production with HTTPS
        max_age=86400  # 1 day
    )
    
    return response

@main.route('/api/me', methods=['GET'])
@auth_middleware
def get_current_user():
    return jsonify({'user': request.user})

@main.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.delete_cookie('token')
    return response

@main.route('/api/make-admin', methods=['POST'])
def make_admin():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email required'}), 400
    
    result = users_collection.update_one(
        {'email': email},
        {'$set': {'isAdmin': True}}
    )
    
    if result.matched_count == 0:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({'message': f'{email} is now admin'})

@main.route('/api/analyze2', methods=['POST'])
def analyze_job():
    data = request.get_json()
    url = data.get('url')
    job_post = data.get('job_post')
    has_logo = data.get('has_logo') 
    experience= data.get('experience')
    education= data.get('education')
    employment= data.get('employment')
    hasQuestion= data.get('hasQuestion')

    if not url and not job_post:
        return jsonify({'error': 'Please provide either a URL or job post'}), 400

    try:
        if url:
            job_data = scraper.scrape_job(url=url, has_logo=has_logo , experience=experience, education=education, employment=employment , hasQuestion=hasQuestion)  
        else:
            job_data = scraper.scrape_job(post_text=job_post, has_logo=has_logo, experience=experience, education=education, employment=employment , hasQuestion=hasQuestion)  

        if not job_data:
            return jsonify({'error': 'Failed to extract job data'}), 400

        print("Fraudulent value being returned:", job_data.get("fraudulent"))
        return jsonify(job_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
