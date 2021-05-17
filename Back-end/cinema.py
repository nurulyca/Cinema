from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from flask_bcrypt import Bcrypt
from flask_jwt import JWT, jwt_required, current_identity
import jwt
import re
from flask_cors import CORS, cross_origin

cors_config = {
    "origins": ["http://127.0.0.1:5001"],
    "methods": ["GET", "POST", "PUT", "DELETE"]
}

app = Flask(__name__)

CORS(app, resources={
    r"/*": cors_config
})

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

app.config['SECRET_KEY']='secret'
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:postgres@localhost:5432/cinema'

connect_str = 'postgresql://postgres:postgres@localhost:5432/cinema'
engine = create_engine(connect_str, echo=False)

class Auditorium(db.Model):
    auditorium_id = db.Column(db.Integer, primary_key=True, index=True)

class Seat(db.Model):
    seat_id = db.Column(db.Integer, primary_key=True, index=True)
    auditorium_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    row_id = db.Column(db.String, nullable=False)
    row_seat_id = db.Column(db.Integer, nullable=False)

class Movie(db.Model):
    movie_id = db.Column(db.Integer, primary_key=True)
    movie_name = db.Column(db.String, nullable=False)
    movie_duration = db.Column(db.Integer, nullable=False)
    movie_category = db.Column(db.String, nullable=False)
    movie_published_year = db.Column(db.Integer, nullable=False)

class ScheduledMovie(db.Model):
    scheduled_movie_id = db.Column(db.Integer, primary_key=True, index=True)
    start_movie = db.Column(db.String, nullable=False)
    end_movie = db.Column(db.String, nullable=False)
    movie_price = db.Column(db.Integer, nullable=False)
    movie_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    auditorium_id = db.Column(db.Integer, nullable=False)

class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True, index=True)
    customer_email = db.Column(db.String, nullable=False, unique=True)
    customer_name = db.Column(db.String, nullable=False)
    customer_password = db.Column(db.String, nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False)

class Booking(db.Model):
    booking_id = db.Column(db.Integer, primary_key=True, index=True)
    customer_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    scheduled_movie_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    booking_status = db.Column(db.String, nullable=False)
    total_price = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

class BookingItem(db.Model):
    __tablename__ = 'booking_item'
    __table_args__ = (
        db.UniqueConstraint('seat_id', 'scheduled_movie_id'),
    )
    booking_item_id = db.Column(db.Integer, primary_key=True, index=True)
    booking_id = db.Column(db.Integer, foreign_key=True, index=True)
    seat_id = db.Column(db.Integer, nullable=False)
    scheduled_movie_id = db.Column(db.Integer, foreign_key=True, nullable=False)

class Wallet(db.Model):
    wallet_id = db.Column(db.Integer, primary_key=True, index=True)
    total_amount = db.Column(db.Integer, nullable=False, default=0)
    customer_id = db.Column(db.Integer, foreign_key=True, nullable=False)

class WalletTransaction(db.Model):
    wallet_transaction_id = db.Column(db.Integer, primary_key=True, index=True)
    total_amount = db.Column(db.Integer, nullable=False)
    wallet_id = db.Column(db.Integer, foreign_key=True, nullable=False)
    booking_id = db.Column(db.Integer, nullable=True)
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
    
    pw_hash = bcrypt.generate_password_hash(data.get('customer_password')).decode('UTF-8')
    if 'is_admin' in data:
        cust = Customer(
            customer_name = data['customer_name'],
            customer_email = data['customer_email'],
            customer_password = pw_hash,
            is_admin = data['is_admin']
        )
    else:
        cust = Customer(
            customer_name = data['customer_name'],
            customer_email = data['customer_email'],
            customer_password = pw_hash
        )
    try:
        db.session.add(cust)
        db.session.commit()
    except:
        return {
            'error' : 'Email has been taken.'
        }, 400
    
    if 'is_admin' not in data:
    #creating new wallet at the same time while registering new customer
        wall = Wallet(
            customer_id = cust.customer_id
        )
        try:
            db.session.add(wall)
            db.session.commit()
        except:
            return {
                'error' : 'Error in creating wallet.'
            }, 400

        return{
            'customer_id' : cust.customer_id,
            'name' : cust.customer_name,
            'email' : cust.customer_email,
            'password' : cust.customer_password,
            'wallet_id': wall.wallet_id
        }, 201
    else:
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
        }), 401
    try:
        cust = Customer.query.filter_by(customer_email = data['customer_email']).first_or_404()
    except:
        return jsonify ({
            "message" : "Wrong email or password!"
        }), 401

    payload = {'customer_id' : cust.customer_id, 'customer_email' : cust.customer_email, 'is_admin': cust.is_admin}
    encoded_jwt = jwt.encode(payload, 'secret', algorithm="HS256")

    if bcrypt.check_password_hash(cust.customer_password, data["customer_password"]):
        return jsonify ({
            'customer_id' : cust.customer_id,
            'name' : cust.customer_name,
            'email' : cust.customer_email,
            'password' : cust.customer_password,
            'access_token' : encoded_jwt.decode('UTF-8')
            })
    else:
        return jsonify ({
            "message" : "Wrong email or password!"
        }), 401

@app.route('/update_customer/', methods = ['PUT'])
def update_customer():
    data = request.get_json()

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"
    
    if not 'customer_id' in decoded_token and not 'customer_email' in decoded_token:
        return jsonify({
            'error' : 'Bad Request',
            'message' : 'Access token is invalid!'
        }), 401

    cust = Customer.query.filter_by(customer_id = decoded_token["customer_id"]).first_or_404()

    if 'is_admin' in data:
        return jsonify({
            'error' : 'Unauthorized',
            'message' : 'You can not be an admin.'
        }), 401

    if 'customer_password' in data:
        pw_hash = bcrypt.generate_password_hash(data.get('customer_password')).decode('UTF-8')
        cust.customer_password = pw_hash

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

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"

    if decoded_token['is_admin'] != True:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'You are not an admin.'
        }), 401
    
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

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"

    if decoded_token['is_admin'] != True:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'You are not an admin.'
        }), 401

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

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"

    if decoded_token['is_admin'] != True:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'You are not an admin.'
        }), 401

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
        auditorium_id = data['auditorium_id'],
        )

    db.session.add(schedule)
    db.session.commit()
    return {
        'scheduled_movie_id' : schedule.scheduled_movie_id,
        'start_time' : schedule.start_movie,
        'end_time' : schedule.end_movie,
        'price' : schedule.movie_price,
        'movie_id' : schedule.movie_id,
        'auditorium_id' : schedule.auditorium_id,
    }, 201

@app.route('/edit_movie_schedule/<id>', methods = ['PUT'])
def edit_movie_schedule(id):
    data = request.get_json()

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"

    if decoded_token['is_admin'] != True:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'You are not an admin.'
        }), 401

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
        'movie_id' : schedule.movie_id,
        'auditorium_id' : schedule.auditorium_id
        }, 201

@app.route('/list_movie')
def get_all_movie():
    all = []
    with engine.connect() as connection:
        qry = text("SELECT * FROM movie")
        result = connection.execute(qry)
        for item in result:
            all.append({
                'movie_id': item[0],
                'title': item[1],
                'duration' : item[2],
                'published_year' : item[3],
                'movie_poster': item[5],
                'category' : item[4],

            })
    return jsonify(all)

@app.route('/list_movie/<date>')
def get_list_movie(date):
    all = []
    with engine.connect() as connection:
        qry = text("SELECT * FROM movie JOIN scheduled_movie USING (movie_id) WHERE start_movie ILIKE '{}%'".format(date))
        result = connection.execute(qry, date=date)
        for item in result:
            all.append({
                'title': item[1],
                'duration' : item[2],
                'release_year' : item[3],
                'category' : item[4],
                'start_time' : item[7],
                'end_time' : item[8],
                'price' : item[9],
                'poster' : item[5],
                'movie_id': item[0]
            })
    return jsonify(all)


@app.route('/search_movie/<keyword>')
def search_movie(keyword):
    all = []
    with engine.connect() as connection:
        qry = text("SELECT * FROM movie JOIN scheduled_movie USING (movie_id) WHERE movie_name ILIKE'%{}%' OR start_movie ILIKE '{}%';".format(keyword, keyword))
        result = connection.execute(qry)
        for item in result:
            all.append({
                'title': item[1],
                'duration' : item[2],
                'release_year' : item[3],
                'category' : item[4],
                'start_time' : item[7],
                'end_time' : item[8],
                'price' : item[9],
                'poster' : item[5],
                'movie_id': item[0]
            })
    return jsonify(all)

@app.route('/detail_movie/<id>')
def detail_movie(id):
    all = []
    with engine.connect() as connection:
        qry = text("SELECT * FROM movie JOIN scheduled_movie USING (movie_id) WHERE movie_id=:id")
        result = connection.execute(qry, id=id)
        for item in result:
            all.append({
                'title': item[1],
                'duration' : item[2],
                'release_year' : item[3],
                'category' : item[4],
                'start_time' : item[7],
                'end_time' : item[8],
                'price' : item[9],
                'poster' : item[5]
            })
    return jsonify(all)

@app.route('/top_up/<id>/', methods = ['PUT'])
def top_up(id):
    data = request.get_json()

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"

    if decoded_token['is_admin'] != True:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'You are not an admin.'
        }), 401

    #query from Wallet class to get the account by ID
    top = Wallet.query.filter_by(wallet_id=id).first_or_404()

    if 'total_amount' in data:
        top.total_amount += data['total_amount']
    
    db.session.commit()

    #query from WalletTransaction class to add the transaction history into database
    wallTrans = WalletTransaction(
        wallet_id = id,
        total_amount = data['total_amount'],
        transaction_status = "Top up"
    )
    db.session.add(wallTrans)
    db.session.commit()

    return {
        'wallet_id' : top.wallet_id,
        'total_amount' : top.total_amount,
        'customer_id' : top.customer_id,
        'transaction_status' : wallTrans.transaction_status
    }, 201

@app.route('/buy_ticket/', methods=['POST'])
def buy_ticket():
    data = request.get_json()

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"
    
    if not 'customer_id' in decoded_token and not 'customer_email' in decoded_token:
        return jsonify({
            'error' : 'Bad Request',
            'message' : 'Access token is invalid!'
        }), 401

    if not 'array_seats' in data or not 'scheduled_movie_id' in data or not 'wallet_id' in data:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Array seat, customer ID, scheduled movie ID, wallet ID or booking status can not be empty'
        }), 400

    if len(data["array_seats"]) == 0:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Array seats can not be empty'
        }), 400

    try:
        schedule = ScheduledMovie.query.filter_by(scheduled_movie_id=data['scheduled_movie_id']).first_or_404()
    except:
        return "Movie within the ID does not exist"

    with engine.connect() as connection:
        qry = text("SELECT * FROM booking_item WHERE seat_id IN {} and scheduled_movie_id=:id".format(tuple(data['array_seats'])))
        result = connection.execute(qry, id=data["scheduled_movie_id"])
        if len(list(result)) > 0:
            return "The chosen seat is unavailable."
    
    #totalling the price of movie 
    total_price = schedule.movie_price * len(data["array_seats"])

    wal = Wallet.query.filter_by(wallet_id = data['wallet_id']).first_or_404()

    if total_price <= wal.total_amount:
        book = Booking(
            customer_id = decoded_token['customer_id'],
            scheduled_movie_id = data['scheduled_movie_id'],
            booking_status = "Paid",
            total_price = total_price,
            quantity = len(data["array_seats"])
        )
        wal.total_amount -= total_price
        try:
            db.session.add(book)
            db.session.commit()
        except:
            return "Your chosen seat is unavailable."
    else:
        return "Saldo is not sufficient, top up first!"

    for seat_id in data["array_seats"]:
        book_item = BookingItem(
            seat_id = seat_id,
            scheduled_movie_id = data['scheduled_movie_id'],
            booking_id = book.booking_id
        )
        try:
            db.session.add(book_item)
            db.session.commit()
        except:
            return "Your chosen seat is unavailable."

    with engine.connect() as connection:
        all = []
        qry = text("SELECT * FROM booking_item JOIN scheduled_movie USING (scheduled_movie_id) JOIN booking USING(booking_id) JOIN movie USING(movie_id) WHERE booking_id=:booking_id")
        result = connection.execute(qry, booking_id=book.booking_id)
        for item in result:
            all.append({
                'booking_id': item[1], 
                'seat_id': item[4], 
                'title': item[14],
                'booking_status': item[11],
                'start_time' : item[5],
                'end_time' : item[6],
                'auditorium_id' : item[8],
                'total_price' : item[13],
                'total_quantity' : item[12]
            })
    return jsonify(all)

@app.route('/pay_ticket/', methods = ['POST'])
def pay_ticket():
    data = request.get_json()

    token = request.headers.get("access_token").encode('UTF-8')

    try:
        decoded_token = jwt.decode(token, 'secret', algorithm=["HS256"])
    except jwt.exceptions.DecodeError:
        return "Access token is invalid!"

    if not 'customer_id' in decoded_token and not 'customer_email' in decoded_token:
        return jsonify({
            'error' : 'Bad Request',
            'message' : 'Access token is invalid!'
        }), 401

    if not 'wallet_id' in data and not 'booking_id' in data:
        return jsonify({
            'error' : 'Bad Request',
            'message' : 'Wallet ID or booking ID must be given'
        }), 400
    
    #query of filtering the Booking class using booking ID
    pay = Booking.query.filter_by(booking_id = data['booking_id']).first_or_404()

    #query of filtering the Wallet class using wallet ID
    wal = Wallet.query.filter_by(wallet_id = data['wallet_id']).first_or_404()

    if decoded_token["customer_id"] != wal.customer_id:
         return jsonify({
            'error' : 'Bad Request',
            'message' : 'You do not belong to this wallet!'
        }), 400

    #validate if the saldo is sufficient, then updating the booking status
    if pay.total_price <= wal.total_amount :
        wal.total_amount -= pay.total_price
        pay.booking_status = "Paid"
    #otherwise, then return this.
    else:
        return "Saldo is not sufficient, top up first!"
    db.session.commit()

    #if the saldo is sufficient, then it will automatically create transaction history from the WalletTransaction
    wallTrans = WalletTransaction(
        total_amount = pay.total_price,
        transaction_status = "Success payment",
        wallet_id = wal.wallet_id,
        booking_id = pay.booking_id
    )
    db.session.add(wallTrans)
    db.session.commit()
    return jsonify({
        'booking_id' : pay.booking_id,
        'booking_status' : pay.booking_status,
        'total_saldo' : wal.total_amount,
        'transaction_status' : wallTrans.transaction_status
    })

@app.route('/top_five/')
def top_five():
    all = []
    with engine.connect() as connection:
        qry = text("SELECT movie.movie_id, movie.movie_name, COUNT(booking_item.booking_item_id) AS total FROM booking_item INNER JOIN booking USING(booking_id) INNER JOIN scheduled_movie ON booking_item.scheduled_movie_id = scheduled_movie.scheduled_movie_id INNER JOIN movie USING (movie_id) WHERE booking_status = 'Paid' GROUP BY movie.movie_id ORDER BY total desc limit 5")
        result = connection.execute(qry)
        for item in result:
            all.append({
                'movie_id': item[0],
                'title' : item[1], 
                'sold' : item[2]
            })
    return jsonify(all)

@app.after_request
def after_request_func(response):
        origin = request.headers.get('Origin')
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Headers', 'x-csrf-token')
            response.headers.add('Access-Control-Allow-Methods',
                                'GET, POST, OPTIONS, PUT, PATCH, DELETE')
            if origin:
                response.headers.add('Access-Control-Allow-Origin', origin)
        else:
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            if origin:
                response.headers.add('Access-Control-Allow-Origin', origin)

        return response
