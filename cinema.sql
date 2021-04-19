create table auditorium (
	auditorium_id serial primary key
);

drop table auditorium;

create table row_seat (
	row_seat_id serial primary key,
	auditorium_id integer,
		foreign key (auditorium_id)
		references auditorium(auditorium_id),
	total_row integer,
	seats integer
);

drop table row_seat;

create table seat (
	seat_id serial primary key,
	row_seat_id integer,
		foreign key (row_seat_id)
		references row_seat(row_seat_id),
	seat_name varchar,
	seat_type_id integer,
		foreign key (seat_type_id)
		references seat_type(seat_type_id)
);

drop table seat;

create table seat_type (
	seat_type_id serial primary key,
	seat_type_name varchar
);

drop table seat_type;

create table movie (
	movie_id serial primary key,
	movie_name varchar,
	movie_duration integer,
	movie_published_year integer
);

drop table movie;

create table scheduled_movie (
	scheduled_movie_id serial primary key,
	start_movie timestamp,
	end_movie timestamp,
	movie_price numeric,
	movie_id integer,
		foreign key (movie_id)
		references movie(movie_id),
	auditorium_id integer 
);

drop table scheduled_movie;

create table customer (
	customer_id serial primary key,
	customer_email varchar,
	customer_name varchar,
	customer_password varchar,
	is_admin boolean,
	movie_id integer
);

drop table customer;

create table booking (
	booking_id serial primary key,
	seat_id integer,
	customer_id integer,
		foreign key (customer_id)
		references customer(customer_id),
	movie_id integer,
	booking_status varchar
);

drop table booking;

create table wallet (
	wallet_id serial primary key,
	total_amount numeric,
	customer_id integer,
		foreign key (customer_id)
		references customer(customer_id)
);

drop table wallet;

create table wallet_transaction (
	wallet_transaction_id serial primary key,
	total_amount numeric,
	wallet_id integer,
		foreign key (wallet_id)
		references wallet(wallet_id),
	booking_id integer,
	transaction_status varchar
);

drop table wallet_transaction;

