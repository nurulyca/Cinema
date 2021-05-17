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
        }).catch(err => {
            console.log(err)
        })
    })
})