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
    getSchedules(movie_id)
    .then(res => {
        console.log(res, "<<schedules")
        const scheduleDiv = document.querySelector('.schedule')
        res.forEach(item => {
            const startTime = item.start_time.split(" ")
            const div = document.createElement('div')
            div.className = "card"
            const pAuditorium = document.createElement('p')
            pAuditorium.innerText = "Auditorium: " + item.auditorium_id
            div.append(pAuditorium)
            const p = document.createElement('p')
            p.innerText = "Playing Date: " + new Date(startTime[0]).toDateString()
            div.append(p)
            const pStartTime = document.createElement('p')
            pStartTime.innerText = "Start Time: " + startTime[1]
            div.append(pStartTime)
            const buttonBook = document.createElement('button')
            buttonBook.onclick = e => {    
                getListSeat(item.auditorium_id)
                .then(listSeat => {
                    const seatDiv = document.querySelector('.seats')
                    seatDiv.innerHTML = ""
                    console.log(listSeat)
                    getPaidSeats(item.scheduled_movie_id)
                    .then(paidSeats => {
                        console.log(paidSeats, "PAID")
                    let selectedSeat = [];
                    listSeat.forEach(seat => {
                        
                        const seatBox = document.createElement('div')
                        seatBox.className = "seat-box"
                        seatBox.innerText = seat.row_id + seat.row_seat_id
                    
                        if(paidSeats.includes(seat.seat_id)){
                            seatBox.className = "paid-seat-box"
                        } else {
                            seatBox.onclick = e => {
                                e.preventDefault()
                                selectedSeat.push(seat.seat_id)
                                seatBox.className = "selected-seat-box"
                            }
                        }
                        seatDiv.append(seatBox)
                       
                    })
                    const buttonCheckOut = document.createElement('button');
                    buttonCheckOut.onclick = (e) => {
                        console.log(selectedSeat)

                   }
                   buttonCheckOut.innerText = "Check out";
                   buttonCheckOut.className = "btn btn-outline-danger"
                   seatDiv.append(buttonCheckOut)
                })
                })

            }
            buttonBook.innerText = "Book now!"
            buttonBook.className = "btn btn-outline-warning"
            div.append(buttonBook)
            scheduleDiv.append(div)

        });
    })
})