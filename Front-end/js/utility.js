function createHTMLRow(data) {  
    const row = document.createElement('tr');
    const td = document.createElement('td');
  
    const ticketButton = document.createElement('button');
    const insideTicketButton = document.createTextNode("Ticket");
    ticketButton.className = "ticket-button"
    ticketButton.appendChild(insideTicketButton)
    ticketButton.onclick = () => {
      console.log(data)
      const ticketDiv = document.querySelector('.ticket')
      const divTicket = document.createElement("div");
        divTicket.innerHTML = "";
        divTicket.style = "width: 18rem; border: solid"
        divTicket.className = "card";
        const imgTicket = document.createElement("img");
        imgTicket.src = data.poster
        imgTicket.className = "card-img-top"
        const divBody = document.createElement('div')
        divBody.className = "card-body"
        const ticket = document.createElement('h5')
        ticket.className = "card-title"
        ticket.innerText = "Cinemas Ticket"
        divBody.append(ticket)
        const title = document.createElement('p')
        title.className = "card-text"
        title.innerText = data.title;
        divBody.append(title)
        const seat = document.createElement('p')
        seat.className = "card-text"
        seat.innerText = data.seat;
        divBody.append(seat)
        const time = document.createElement('p')
        time.className = "card-text"
        time.innerText = data.start;
        divBody.append(time)

        divTicket.append(imgTicket);
        divTicket.append(divBody);
        ticketDiv.append(divTicket);
    }
    for (prop in data) {
      // assigning the cell of table that contains data
      console.log(prop)
      if (prop!=='poster') {
        const cell = document.createElement('td');
        cell.innerHTML = data[prop];
        row.appendChild(cell);
      } 
    }
      td.appendChild(ticketButton)
      row.appendChild(td)
      return row;
  }
  
  
  