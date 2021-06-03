document.addEventListener('DOMContentLoaded', function() {
    const movieList  = document.querySelector('.movie-list');
    topFive().then(movies => {
        movies.forEach(item => {
            const divParent = document.createElement('div')
            divParent.className = "movie-list-item"
            divParent.onclick = () => {
                window.location.href = "detail.html?movie_id=" + item.movie_id
            }
            const imgChild = document.createElement('img')
            imgChild.className = "movie-list-item-img"
            imgChild.src = item.movie_poster
            imgChild.alt = ""
            divParent.append(imgChild)
            const spanChild = document.createElement('span')
            spanChild.className = "movie-list-item-title"
            spanChild.innerHTML = item.title
            divParent.append(spanChild)
            const buttonChild = document.createElement('button')
            buttonChild.className = "movie-list-item-button"
            buttonChild.innerHTML = "Book"
            divParent.append(buttonChild)
            movieList.append(divParent)
        });
        console.log(movies)
    })
})
