document.addEventListener('DOMContentLoaded', function() {
    console.log('load');
    let params = window.location.search.split("?")[1]
    params = params.split("=")
    let movie_id = params[1]
    getDetailMovie(movie_id)
    .then(res => {
        const posterImg = document.querySelector(".poster")
        posterImg.src = res[0].poster
        const movieTitle = document.querySelector(".title")
        movieTitle.innerHTML = res[0].title
        const movieGenre = document.querySelector(".genre")
        movieGenre.innerHTML = res[0].category
        const movieDuration = document.querySelector(".duration")
        movieDuration.innerHTML = res[0].duration + " " + "minutes"
        const moviePrice = document.querySelector(".price")
        moviePrice.innerHTML = res[0].price
        const movieRelease = document.querySelector(".release")
        movieRelease.innerHTML = res[0].release_year
        console.log(res)
    })
})