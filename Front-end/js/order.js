document.addEventListener('DOMContentLoaded', function(){
    let customer_data = JSON.parse(localStorage.getItem('customer_data'))
    bookingItem(customer_data.customer_id)
    .then(movies => {
            movies.forEach(booking_item => {
            console.log(movies) 
            const ticketDiv = document.querySelector('.ticket')
            ticketDiv.style = "display: flex; gap: 100px; flex-wrap: wrap"
            const divTicket = document.createElement("div");
                divTicket.innerHTML = "";
                divTicket.style = "width: 18rem; border: solid; border-color: black;"
                divTicket.className = "card border-0";
                const divImg = document.createElement('img')
                divImg.className = "card-img"
                divImg.src = booking_item.poster
                divTicket.append(divImg)
                const divBody = document.createElement('div')
                divBody.className = "card-body"
                const ticket = document.createElement('h5')
                ticket.className = "card-title"
                ticket.innerText = "Cinemas Ticket"
                divBody.append(ticket)
                const title = document.createElement('p')
                title.className = "card-text"
                title.innerText = booking_item.title;
                divBody.append(title)
                const seat = document.createElement('p')
                seat.className = "card-text"
                seat.innerText = booking_item.seat_id;
                divBody.append(seat)
                const time = document.createElement('p')
                time.className = "card-text"
                time.innerText = booking_item.start_time;
                divBody.append(time)
                divTicket.append(divBody);
                ticketDiv.append(divTicket);
                })
            })
            
                
        // const tbody = movieList.querySelector('tbody');
        //     tbody.innerHTML = '';
        //     movies.forEach(item => {
        //         const row = createHTMLRow ({
        //             title: item.title,
        //             start: item.start_time,
        //             seat : item.seat_id,
        //             quantity : item.quantity,
        //             poster : item.poster
        //         });
        //         tbody.appendChild(row)
        //     });
    })     