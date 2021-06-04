document.addEventListener('DOMContentLoaded', function() {
    console.log("load login")
    const registerForm = document.querySelector('#registerForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = new FormData(registerForm);
        const json = JSON.stringify((Object.fromEntries(data)));

        registerCustomer(json)
        .then(res => {
            console.log(res)
            if(!res.message) {
                openModal()
            }else {
                alert(res.message)
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
    window.location.href = "login.html"
}
// Get the modal
var modal = document.getElementById('exampleModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal()
  }
}