document.addEventListener('DOMContentLoaded', function() { 
    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const data = new FormData(loginForm);
        const json = JSON.stringify((Object.fromEntries(data)));
        
        login(json)
        .then(res => {
            localStorage.setItem('access_token', res.access_token)
            localStorage.setItem('customer_data', JSON.stringify(res))
            console.log("res", res)
            if(!res.message) {
                window.location.href = "index.html"
            }else {
               openModal()
            }
        }).catch(err => {
            console.log("err", err)
        })
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
}
// Get the modal
var modal = document.getElementById('exampleModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal()
  }
}