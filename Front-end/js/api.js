// get all movies
function getAllMovies(){
    return fetch('http://localhost:5000/list_movie')
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// get detail movie
function getDetailMovie(id) {
    return fetch('http://localhost:5000/detail_movie/' + id)
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// get list movie by title
function getListByTitle(title){
    return fetch('http://localhost:5000/search_movie/' + title)
        .then(response => response.json())
        .then(jsonResponse => jsonResponse)
}

// to login
function login(payload){
    console.log(payload)
    return fetch('http://localhost:5000/login_customer/', {
        method:"POST",
        mode: "cors",
        headers: { 
            'Content-Type' : 'application/json'
          },
        body: payload })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse)
}

// to register
function registerCustomer(payload){
    console.log(payload)
    return fetch('http://localhost:5000/register_customer/', {
        method:"POST",
        headers: { 
            'Content-Type' : 'application/json'
          },
        body: payload })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse)
}

// get all list seat
function getListSeat(id) {
    return fetch('http://localhost:5000/list_seat/' + id)
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// get all schedules
function getSchedules(id) {
    return fetch('http://localhost:5000/get_schedules_by_movie_id/' + id)
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// get paid seats
function getPaidSeats(id) {
    return fetch('http://localhost:5000/paid_seat/' + id)
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// post ticket booking
function buyTicket(payload, token){
    return fetch('http://localhost:5000/buy_ticket/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// get top 5 movies
function topFive(){
    return fetch('http://localhost:5000/top_five/')
    .then(response => response.json())
    .then(jsonResponse => jsonResponse) 
}

// update personal info
function updateInfo(){
    return fetch('http://localhost:5000/update_customer/')
    .then(response => response.json())
    .then(jsonResponse => jsonResponse) 
}

// to get the amount saldo left
function saldoLeft(id){
    return fetch('http://localhost:5000/saldo_left/' + id)
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}

// to top up
function topUp(payload, token, id){
    return fetch('http://localhost:5000/top_up/' + id + '/', {
        method:"PUT",
        headers: { 
            'Content-Type' : 'application/json',
            'access_token' : token
          },
        body: payload})
        .then(response => response.json())
        .then(jsonResponse => jsonResponse)
}

// login Admin
function loginAdmin(payload){
    return fetch('http://localhost:5000/login_customer/', {
        method:"POST",
        mode: "cors",
        headers: { 
            'Content-Type' : 'application/json',
          },
        body: payload })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse)
}

// get booking item by customer id
function bookingItem(id) {
    return fetch('http://localhost:5000/booking_item/' + id)
    .then(response => response.json())
    .then(jsonResponse => jsonResponse)
}