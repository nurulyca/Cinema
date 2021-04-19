from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify
import re

app = Flask(__name__)
db = SQLAlchemy(app)

app.config['SECRET_KEY']='secret'
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:postgres@localhost:5432/cinema'

class Auditorium(db.Model):
    auditorium_id = db.Column(db.Integer, primary_key=True, index=True)

class RowSeat(db.Model):
    row_seat_id = db.Column(db.Integer, primary_key=True, index=True)
    auditorium_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    total_row = db.Column(db.Integer, nullable=False)
    seats = db.Column(db.Integer, nullable=False)

class Seat(db.Model):
    seat_id = db.Column(db.Integer, primary_key=True, index=True)
    row_seat_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    seat_name = db.Column(db.String, nullable=False)
    seat_type_id = db.Column(db.Integer, foreign_key=True, nullable=False)

class SeatType(db.Model):
    seat_type_id = db.Column(db.Integer, primary_key=True)
    seat_type_name = db.Column(db.String, nullable=False)

class Movie(db.Model):
    movie_id = db.Column(db.Integer, primary_key=True)
    movie_name = db.Column(db.String, nullable=False)
    movie_duration = db.Column(db.Integer, nullable=False)
    movie_category = db.Column(db.String, nullable=False)
    movie_published_year = db.Column(db.Integer, nullable=False)

class ScheduledMovie(db.Model):
    scheduled_movie_id = db.Column(db.Integer, primary_key=True, index=True)
    start_movie = db.Column(db.Integer, nullable=False)
    end_movie = db.Column(db.Integer, nullable=False)
    movie_price = db.Column(db.DECIMAL(asdecimal=False), nullable=False)
    movie_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    auditorium_id = db.Column(db.Integer, nullable=False)

class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True, index=True)
    customer_email = db.Column(db.String, nullable=False, unique=True)
    customer_name = db.Column(db.String, nullable=False)
    customer_password = db.Column(db.String, nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)

class Booking(db.Model):
    booking_id = db.Column(db.Integer, primary_key=True, index=True)
    seat_id = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    booking_status = db.Column(db.String, nullable=False)

class Wallet(db.Model):
    wallet_id = db.Column(db.Integer, primary_key=True, index=True)
    total_amount = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, foreign_key=True, nullable=False)

class WalletTransaction(db.Model):
    wallet_transaction_id = db.Column(db.Integer, primary_key=True, index=True)
    total_amount = db.Column(db.Integer, nullable=False)
    wallet_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    booking_id = db.Column(db.Integer, nullable=False)
    transaction_status = db.Column(db.String, nullable=False)

regex = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'

@app.route('/register_customer/', methods = ['POST'])
def create_customer():
    data = request.get_json()
    if not 'customer_name' in data and not 'customer_email' in data and not 'customer_password' in data:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Name or email or password not given'
        }), 400
    if len(data['customer_name']) < 2:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Name must contain minimum of 2 letters'
        }), 400
    if (re.search(regex, data['customer_email'])) == None:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Email is invalid!'
        }), 400
    
    cust = Customer(
        customer_name = data['customer_name'],
        customer_email = data['customer_email'],
        customer_password = data['customer_password']
    )
    try:
        db.session.add(cust)
        db.session.commit()
    except:
        return {
            'error' : 'Email has been taken.'
        }, 400
    
    return{
        'customer_id' : cust.customer_id,
        'name' : cust.customer_name,
        'email' : cust.customer_email,
        'password' : cust.customer_password
    }, 201

@app.route('/login_customer/', methods = ['POST'])
def login_customer():
    data = request.get_json()
    if not 'customer_email' in data and not 'customer_password' in data:
        return jsonify({
            'error' : 'Bad Request',
            'message' : 'Email or password not given'
        }), 400
    try:
        cust = Customer.query.filter_by(customer_email = data['customer_email']).first_or_404()
    except:
        return jsonify ({
            "message" : "Wrong email or password!"
        }), 401

    return jsonify ({
            'customer_id' : cust.customer_id,
            'name' : cust.customer_name,
            'email' : cust.customer_email,
            'password' : cust.customer_password
            })

@app.route('/update_customer/<id>', methods = ['PUT'])
def update_customer(id):
    data = request.get_json()
    cust = Customer.query.filter_by(customer_id = id).first_or_404()
    if 'customer_password' in data:
        cust.customer_password = data['customer_password']
    if 'customer_email' in data:
        if (re.search(regex, data['customer_email'])):
            cust.customer_email = data['customer_email']
        else:
            return jsonify({
                'error': 'Bad Request',
                'message': 'Email is invalid!'
                }), 400
    if 'customer_name' in data:
        if len(data['customer_name']) > 2:
            cust.customer_name = data['customer_name']
        else:
            return jsonify({
            'error': 'Bad Request',
            'message': 'Name must contain minimum of 2 letters'
        }), 400
    db.session.commit()
    return jsonify({
            'customer_id' : cust.customer_id,
            'name' : cust.customer_name,
            'email' : cust.customer_email,
            'password' : cust.customer_password
        })

@app.route('/create_movie/', methods=['POST'])
def create_movie():
    data = request.get_json()
    if not 'movie_name' in data and not 'movie_category' in data:
        return jsonify({
            'error' : 'Bad request',
            'message' : 'Title or category of movie not given'
        }), 400

    if len(data['movie_name']) < 2:
        return jsonify ({
            'error' : 'Bad Request',
            'message' : 'Title of movie must contain minimum of 2 letters'
        }), 400
    
    mov = Movie(
        movie_name = data['movie_name'],
        movie_duration = data['movie_duration'],
        movie_published_year = data['movie_published_year'],
        movie_category = data['movie_category']
        )
    db.session.add(mov)
    db.session.commit()
    return {
        'movie_id' : mov.movie_id,
        'title' : mov.movie_name,
        'duration' : mov.movie_duration,
        'category' : mov.movie_category,
        'published_year' : mov.movie_published_year
        }, 201

@app.route('/update_movie/<id>/', methods = ['PUT'])
def update_movie(id):
    data = request.get_json()
    mov = Movie.query.filter_by(movie_id = id).first_or_404()

    if 'movie_name' in data:
        mov.movie_name = data['movie_name']
    if 'movie_duration' in data:
        mov.movie_duration = data['movie_duration']
    if 'movie_published_year' in data:
        mov.movie_published_year = data['movie_published_year']
    if 'movie_category' in data:
        mov.movie_category = data['movie_category']
    
    db.session.commit()
    return {
        'movie_id' : mov.movie_id,
        'title' : mov.movie_name,
        'duration' : mov.movie_duration,
        'category' : mov.movie_category,
        'published_year' : mov.movie_published_year
        }, 201

@app.route('/add_movie_schedule/', methods = ['POST'])
def add_movie_schedule():
    data = request.get_json()
    if not 'start_movie' in data and not 'end_movie' in data and not 'movie_id' in data and not 'movie_price' in data and not 'auditorium_id' in data:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Start or end or ID or price of the movie not given'
        }), 400

    schedule = ScheduledMovie(
        start_movie = data['start_movie'],
        end_movie = data['end_movie'],
        movie_id = data['movie_id'],
        movie_price = data['movie_price'],
        auditorium_id = data['auditorium_id']
        )

    db.session.add(schedule)
    db.session.commit()
    return {
        'scheduled_movie_id' : schedule.scheduled_movie_id,
        'start_time' : schedule.start_movie,
        'end_time' : schedule.end_movie,
        'price' : schedule.movie_price,
        'movie_id' : schedule.movie_price,
        'auditorium_id' : schedule.auditorium_id
    }, 201
    # return "ok"

@app.route('/edit_movie_schedule/<id>', methods = ['PUT'])
def edit_movie_schedule(id):
    data = request.get_json()
    schedule = ScheduledMovie.query.filter_by(scheduled_movie_id = id).first_or_404()

    if 'start_movie' in data:
        schedule.start_movie = data['start_movie']
    if 'end_movie' in data:
        schedule.end_movie = data['end_movie']
    if 'movie_price' in data:
        schedule.movie_price = data['movie_price']
    
    db.session.commit()
    return {
        'scheduled_movie_id' : schedule.scheduled_movie_id,
        'start_time' : schedule.start_movie,
        'end_time' : schedule.end_movie,
        'price' : schedule.movie_price,
        'movie_id' : schedule.movie_price,
        'auditorium_id' : schedule.auditorium_id
        }, 201

# @app.route('/list_movie/<date>')
# def get_list_movie(date):
#     schedule = Scheduled_Movie.query.filter_by(start_movie = date)
#     return jsonify({
        
#     })

