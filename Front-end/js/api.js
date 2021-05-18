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

// get list movie by date
function getListByDate(date){
    return fetch('http://localhost:5000/list_movie/' + date)
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