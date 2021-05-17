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