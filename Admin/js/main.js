document.addEventListener('DOMContentLoaded', function() {  
    toggleAdd = document.getElementById("toggle-add");
    const search_bar = document.querySelector(".search_bar");
    const searchTitle = document.querySelector('input[name="searchname"]');
    const movieList  = document.querySelector('.movie-list');
    const divRegister = document.querySelector(".register-button");
    const registerLink = document.querySelector(".register-link");
    let access_token = localStorage.getItem('access_token_admin');
    const addForm = document.querySelector('#addMovie');

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
    
    toggleAdd.onclick = () => {
        var x = document.getElementById("addMovie")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }
    
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(addForm);
        const objectData = Object.fromEntries(data);
        const payload = {
            movie_name: objectData.addtitle,
            movie_duration : objectData.addduration,
            movie_published_year : objectData.addyear,
            movie_category : objectData.addgenre,
            movie_price : objectData.addprice,
            movie_poster : objectData.addposter
        }
        const json = JSON.stringify(payload);
        const token = localStorage.getItem('access_token_admin');
        addMovie(json, token)
        .then(items => {
            console.log(items)
            const payload = {
                start_movie :"2021-05-08 10:30:00",
                end_movie : "2021-05-08 12:00:00",
                movie_id : items.movie_id,
                movie_price : 25000,
                auditorium_id : 1
            }
            const json = JSON.stringify(payload);
            const token = localStorage.getItem('access_token_admin');
            addScheduleMovie(json, token)
            .then(items => {
                console.log(items)
                window.location.reload()
                })
            getAllMovies().then(movies => {
                movieList.innerHTML = ""
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
                window.location.reload()
            })
        })
    })
    
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