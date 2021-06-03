document.addEventListener('DOMContentLoaded', function() {  
    const search_bar = document.querySelector(".search");
    const searchTitle = document.querySelector('input[name="searchname"]');
    const movieList  = document.querySelector('.movie-list');
    const divRegister = document.querySelector(".register-button")
    const registerLink = document.querySelector(".register-link")
    let access_token = localStorage.getItem('access_token')

    if(access_token) {
        divRegister.innerHTML = ""
        const buttonLogout = document.createElement('button')
        buttonLogout.className = "button-logout"
        buttonLogout.innerText = "Logout"
        buttonLogout.onclick = () => {
            localStorage.clear()
            divRegister.innerHTML = ""
            divRegister.append(registerLink) 
        }
        divRegister.append(buttonLogout)
    }
    search_bar.onclick = e => {
        e.preventDefault()
        movieList.innerHTML = ""
        getListByTitle(searchTitle.value)
          .then(titles => {
                console.log(titles)
                titles.forEach(item => {
                const divParent = document.createElement('div')
                divParent.className = "movie-list-item"
                divParent.onclick = () => {
                    window.location.href = "detail.html?movie_id=" + item.movie_id
                }
                const imgChild = document.createElement('img')
                imgChild.className = "movie-list-item-img"
                imgChild.src = item.poster
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
            })
        }
    getAllMovies().then(movies => {
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