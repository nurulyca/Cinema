document.addEventListener('DOMContentLoaded', function(){
    let customer_data = JSON.parse(localStorage.getItem('customer_data'))
    console.log('load');
    bookingItem(customer_data.customer_id)
    .then(movies => {
        console.log(movies) 
        const movieList = document.querySelector('#bookingItem');
        const tbody = movieList.querySelector('tbody');
            tbody.innerHTML = '';
            movies.forEach(item => {
                const row = createHTMLRow ({
                    title: item.title,
                    start: item.start_time,
                    seat : item.seat_id,
                    quantity : item.quantity,
                    poster : item.poster
                });
                tbody.appendChild(row)
            });
    })     
        })