document.addEventListener('DOMContentLoaded', function() {
    console.log('load');
    // get the detail movie by movie_id
    let params = window.location.search.split("?")[1]
    params = params.split("=")
    let movie_id = params[1]
    let moviePoster = ""
    getDetailMovie(movie_id)
    .then(res => {
        const posterImg = document.querySelector(".poster")
        posterImg.src = res[0].poster
        localStorage.setItem("detail_movie", JSON.stringify(res[0]))
        moviePoster = res[0].poster
        const movieTitle = document.querySelector(".title")
        movieTitle.innerHTML = res[0].title
        const movieGenre = document.querySelector(".genre")
        movieGenre.innerHTML = res[0].category
        const movieDuration = document.querySelector(".duration")
        movieDuration.innerHTML = res[0].duration + " " + "minutes"
        const moviePrice = document.querySelector(".price")
        moviePrice.innerHTML = "IDR" + " " + res[0].price
        const movieRelease = document.querySelector(".release")
        movieRelease.innerHTML = res[0].release_year
        console.log(res)
    })

    // get movie schedule by movie_id
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
                // get seat list by auditorium ID 
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
                        if (paidSeats.includes(seat.seat_id)) {
                            seatBox.className = "paid-seat-box"
                        } else {
                            seatBox.onclick = e => {
                                e.preventDefault()
                                selectedSeat.push(seat.seat_id)
                                seatBox.className = "selected-seat-box"
                                if (selectedSeat.includes(seat.seat_id)) {
                                    seatBox.onclick = e => {
                                       window.location.reload()
                                    }
                                }
                            }
                        }
                        seatDiv.append(seatBox)
                       
                    })
                    const buttonCheckOut = document.createElement('button');
                    buttonCheckOut.onclick = (e) => {
                        e.preventDefault()
                        let customer_data = JSON.parse(localStorage.getItem('customer_data'))
                        let access_token = localStorage.getItem('access_token')

                        const data = new FormData();
                        data.append('scheduled_movie_id', item.scheduled_movie_id)
                        data.append('wallet_id', customer_data.wallet_id,)
                        data.append('array_seats', selectedSeat)
                        let json = Object.fromEntries(data)
                     
                        buyTicket(json, access_token)
                        .then(result => {
                            console.log(result, '======================')
                            if(!result.message) {
                                const booked = localStorage.getItem("booking_item");
                                if (booked) {
                                    arrBook = JSON.parse(booked)
                                    arrBook.push(result[0]);
                                    localStorage.setItem("booking_item", JSON.stringify(arrBook))
                                } else {
                                    const listBook = [];
                                    listBook.push(result[0]);
                                    localStorage.setItem("booking_item", JSON.stringify(listBook))
                                }
                                openModal()
                            } else {
                                const alertDiv = document.createElement('div')
                                alertDiv.className = "alert alert-danger"
                                alertDiv.role = "alert"
                                alertDiv.innerText = result.message
                                div.append(alertDiv)
                            }
                        }).catch(err => {
                            console.log(err)
                        })

                   }
                   buttonCheckOut.innerText = "Check out";
                   buttonCheckOut.className = "btn btn-outline-warning check-out"
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

function openModal() {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("exampleModal").style.display = "block"
    document.getElementById("exampleModal").classList.add("show")
}
function closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("exampleModal").style.display = "none"
    document.getElementById("exampleModal").classList.remove("show")
    window.location.href = "order.html"
}
// Get the modal
var modal = document.getElementById('exampleModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal()
  }
}