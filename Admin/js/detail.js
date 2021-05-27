document.addEventListener('DOMContentLoaded', function() {
    const toggleEdit = document.getElementById("toggle-edit");
    const toggleAdd = document.getElementById("add-schedule-button");
    const updateTitle = document.querySelector('input[name="updatetitle"]');
    const updateGenre = document.querySelector('input[name="updategenre"]');
    const updateDuration = document.querySelector('input[name="updateduration"]');
    const updatePrice = document.querySelector('input[name="updateprice"]');
    const updateRelease = document.querySelector('input[name="updateyear"]');
    const addScheduleForm = document.querySelector('#add-schedule');
    const editScheduleForm = document.querySelector('#edit-schedule');
    const editScStart = document.querySelector('input[name="editstart"]');
    const editScEnd = document.querySelector('input[name="editend"]');
    const editScPrice = document.querySelector('input[name="editscprice"]');
    const editScAuditorium = document.querySelector('input[name="editauditorium"]');
    let scheduled_movie_id = 0;
    console.log('load');
    // get the detail movie by movie_id
    let params = window.location.search.split("?")[1]
    params = params.split("=")
    let movie_id = params[1];
    let moviePoster = "";
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
        moviePrice.innerHTML = res[0].price
        const movieRelease = document.querySelector(".release")
        movieRelease.innerHTML = res[0].release_year
        console.log(res)
    })

    toggleEdit.onclick = () => {
        const detailMovie = JSON.parse(localStorage.getItem("detail_movie"))
        updateTitle.value = detailMovie.title
        updateGenre.value = detailMovie.category
        updatePrice.value = detailMovie.price
        updateRelease.value = detailMovie.release_year
        updateDuration.value = detailMovie.duration
        var x = document.getElementById("updateMovie")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }

    const updateForm = document.querySelector('#updateMovie');
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(updateForm);
        const objectData = Object.fromEntries(data)
        const payload = {
            movie_name : objectData.updatetitle,
            movie_duration : objectData.updateduration,
            movie_published_year : objectData.updateyear,
            movie_category : objectData.updategenre
        }

        console.log(objectData)
        console.log(payload)
        const json = JSON.stringify(payload);
        const token = localStorage.getItem('access_token_admin')
        updateMovie(json, token, movie_id)
        .then(res => {
            console.log(res)
            window.location.reload()
        })
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
            const divTop = document.createElement('div');
            divTop.className = "container"
            const pAuditorium = document.createElement('p')
            pAuditorium.innerText = "Auditorium: " + item.auditorium_id
            
            const p = document.createElement('p')
            p.innerText = "Playing Date: " + new Date(startTime[0]).toDateString()
            const pStartTime = document.createElement('p')
            pStartTime.innerText = "Start Time: " + startTime[1]
            
            const toggleItem = document.createElement('i')
            toggleItem.className = "far fa-edit fa-2x mb-4"
            toggleItem.onclick = () => {
                scheduled_movie_id = item.scheduled_movie_id
                editScStart.value = item.start_time
                editScEnd.value = item.end_time
                editScPrice.value = item.price
                editScAuditorium.value = item.auditorium_id
                var x = document.getElementById("edit-schedule")
                if (x.style.display === "none") {
                x.style.display = "block";
                } else {
                x.style.display = "none";
                }
            }

            divTop.append(pAuditorium)
            divTop.append(p)
            divTop.append(pStartTime)
            divTop.append(toggleItem)
            div.append(divTop);
            


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
                        let customer_data = JSON.parse(localStorage.getItem('customer_data'))
                        let access_token = localStorage.getItem('access_token')

                        const data = new FormData();
                        data.append('scheduled_movie_id', item.scheduled_movie_id)
                        data.append('wallet_id', customer_data.wallet_id,)
                        data.append('array_seats', selectedSeat)
                        let json = Object.fromEntries(data)
                     
                        buyTicket(json, access_token)
                        .then(result => {
                            console.log(result)
                            if(!result.message) {
                                localStorage.setItem("booking_item", JSON.stringify(result[0]))
                                window.location.reload()
                            } else {
                                const alertDiv = document.createElement('div')
                                alertDiv.className = "alert alert-danger"
                                alertDiv.role = "alert"
                                alertDiv.innerText = result.message
                                div.append(alertDiv)
                                // window.location.href = "topup.html"
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

            const bookingItem = JSON.parse(localStorage.getItem("booking_item"));
            const movieData = JSON.parse(localStorage.getItem("detail_movie"));
            if (bookingItem) {
                const divTicket = document.createElement("div");
                divTicket.style = "width: 18rem; border: solid"
                divTicket.className = "card";
                const imgTicket = document.createElement("img");
                imgTicket.src = movieData.poster
                imgTicket.className = "card-img-top"
                const divBody = document.createElement('div')
                divBody.className = "card-body"
                const ticket = document.createElement('h5')
                ticket.className = "card-title"
                ticket.innerText = "Cinemas Ticket"
                divBody.append(ticket)
                const title = document.createElement('p')
                title.className = "card-text"
                title.innerText = movieData.title;
                divBody.append(title)
                const seat = document.createElement('p')
                seat.className = "card-text"
                seat.innerText = bookingItem.seat_id;
                divBody.append(seat)
                const time = document.createElement('p')
                time.className = "card-text"
                time.innerText = bookingItem.start_time;
                divBody.append(time)

                divTicket.append(imgTicket);
                divTicket.append(divBody);
                scheduleDiv.append(divTicket);

            }

        });
    })

    toggleAdd.onclick = () => {
        var x = document.getElementById("add-schedule")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }

    addScheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(addScheduleForm);
        const objectData = Object.fromEntries(data);
        const payload = {
            start_movie : objectData.addstart,
            end_movie : objectData.addend,
            movie_id : objectData.addid,
            movie_price : objectData.addscprice,
            auditorium_id : objectData.addauditorium
        }

        const json = JSON.stringify(payload);
        const token = localStorage.getItem('access_token_admin');
        addScheduleMovie(json, token)
        .then(items => {
            console.log(items)
            window.location.reload()
        })
    })


    editScheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(editScheduleForm);
        const objectData = Object.fromEntries(data);
        const payload = {
            start_movie : objectData.editstart,
            end_movie : objectData.editend,
            movie_id : objectData.editid,
            movie_price : objectData.editscprice,
            auditorium_id : objectData.editauditorium
        }
        console.log(objectData);
        console.log(payload);
        const json = JSON.stringify(payload);
        const token = localStorage.getItem('access_token_admin');
        editScheduleMovie(json, token, scheduled_movie_id)
        .then(res => {
            window.location.reload()
        })
    })

});
