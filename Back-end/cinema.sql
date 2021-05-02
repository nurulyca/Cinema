create table auditorium (
	auditorium_id serial primary key
);

drop table auditorium;

create table seat (
	seat_id integer primary key,
	row_seat_id integer,
	auditorium_id integer,
	row_id varchar
);

insert into  
seat (seat_id, row_seat_id, auditorium_id, row_id)
values
('1', '1', '1', 'A'),
('2', '2', '1', 'A'),
('3', '3', '1', 'A'),
('4', '4', '1', 'A'),
('5', '5', '1', 'A'),
('6', '6', '1', 'A'),
('7', '7', '1', 'A'),
('8', '8', '1', 'A'),
('9', '9', '1', 'A'),
('10', '10', '1', 'A'),
('11', '1', '1', 'B'),
('12', '2', '1', 'B'),
('13', '3', '1', 'B'),
('14', '4', '1', 'B'),
('15', '5', '1', 'B'),
('16', '6', '1', 'B'),
('17', '7', '1', 'B'),
('18', '8', '1', 'B'),
('19', '9', '1', 'B'),
('20', '10', '1', 'B'),
('21', '1', '1', 'C'),
('22', '2', '1', 'C'),
('23', '3', '1', 'C'),
('24', '4', '1', 'C'),
('25', '5', '1', 'C'),
('26', '6', '1', 'C'),
('27', '7', '1', 'C'),
('28', '8', '1', 'C'),
('29', '9', '1', 'C'),
('30', '10', '1', 'C'),
('31', '1', '1', 'D'),
('32', '2', '1', 'D'),
('33', '3', '1', 'D'),
('34', '4', '1', 'D'),
('35', '5', '1', 'D'),
('36', '6', '1', 'D'),
('37', '7', '1', 'D'),
('38', '8', '1', 'D'),
('39', '9', '1', 'D'),
('40', '10', '1', 'D'),
('41', '1', '1', 'E'),
('42', '2', '1', 'E'),
('43', '3', '1', 'E'),
('44', '4', '1', 'E'),
('45', '5', '1', 'E'),
('46', '6', '1', 'E'),
('47', '7', '1', 'E'),
('48', '8', '1', 'E'),
('49', '9', '1', 'E'),
('50', '10', '1', 'E'),
('51', '1', '1', 'F'),
('52', '2', '1', 'F'),
('53', '3', '1', 'F'),
('54', '4', '1', 'F'),
('55', '5', '1', 'F'),
('56', '6', '1', 'F'),
('57', '7', '1', 'F'),
('58', '8', '1', 'F'),
('59', '9', '1', 'F'),
('60', '10', '1', 'F')
;

drop table seat;

create table movie (
	movie_id serial primary key,
	movie_name varchar,
	movie_duration integer,
	movie_published_year integer,
	movie_category varchar
);

drop table movie;

insert into 
movie (movie_name, movie_duration, movie_published_year, movie_category)
values
('Shadow in the Cloud', '83', '2021', 'Action, Horror, War'),
('Godzilla vs. Kong', '113', '2021', 'Action, Sci-Fi, Thriller'),
('Raya and the Last Dragon', '107', '2021', 'Animation, Action, Adventure'),
('Danur 3: Sunyaruri', '90', '2019', 'Horror'),
('Hellboy','121',  '2019', 'Action, Adventure, Fantasy'),
('Pulau Plastik', '102', '2021', 'Dokumenter'),
('Honest Thief', '98', '2020', 'Action, Crime, Drama'),
('Black Water: Abyss', '98', '2020', 'Action, Drama, Thriller'),
('Chaos Walking', '109', '2021', 'Adventure, Sci-Fi'),
('The Unholy', '99', '2021', 'Horror'),
('Mortal Kombat', '110', '2021', 'Action, Adventure, Fantasy')
;

create table scheduled_movie (
	scheduled_movie_id serial primary key,
	start_movie varchar,
	end_movie varchar,
	movie_price integer,
	movie_id integer,
		foreign key (movie_id)
		references movie(movie_id),
	auditorium_id integer 
);

drop table scheduled_movie;

insert into  
scheduled_movie (start_movie, end_movie, movie_price, movie_id, auditorium_id)
values
('2021-04-07 15:15:00', '2021-04-07 17:15:00', '25000', '1', '1'),
('2021-04-07 12:15:00', '2021-04-07 13:40:00', '25000', '2', '2'),
('2021-04-07 13:30:00', '2021-04-07 14:45:00', '25000', '3', '1'),
('2021-04-08 11:40:00', '2021-04-08 12:55:00', '25000', '4', '2'),
('2021-04-08 13:30:00', '2021-04-08 14:45:00', '25000', '5', '1'),
('2021-04-08 12:15:00', '2021-04-08 13:40:00', '25000', '6', '3'),
('2021-04-08 15:15:00', '2021-04-08 17:15:00', '25000', '7', '1'),
('2021-04-09 13:30:00', '2021-04-07 14:45:00', '25000', '8', '2'),
('2021-04-09 12:15:00', '2021-04-07 13:40:00', '25000', '9', '1'),
('2021-04-09 11:40:00', '2021-04-07 12:55:00', '25000', '10', '2'),
('2021-04-09 15:15:00', '2021-04-07 17:15:00', '25000', '11', '2')
;


create table customer (
	customer_id serial primary key,
	customer_email varchar unique,
	customer_name varchar,
	customer_password varchar,
	is_admin boolean
);

drop table customer cascade;

create table booking (
	booking_id serial primary key,
	seat_id integer,
	customer_id integer,
		foreign key (customer_id)
		references customer(customer_id),
	scheduled_movie_id integer,
		foreign key (scheduled_movie_id)
		references scheduled_movie(scheduled_movie_id),
	booking_status varchar,
	quantity integer,
	total_price integer,
	 CONSTRAINT bc UNIQUE (seat_id,scheduled_movie_id)

);

drop table booking;

create table wallet (
	wallet_id serial primary key,
	total_amount integer,
	customer_id integer,
		foreign key (customer_id)
		references customer(customer_id)
);

drop table wallet cascade;

create table wallet_transaction (
	wallet_transaction_id serial primary key,
	total_amount integer,
	wallet_id integer,
		foreign key (wallet_id)
		references wallet(wallet_id),
	booking_id integer,
	transaction_status varchar
);


