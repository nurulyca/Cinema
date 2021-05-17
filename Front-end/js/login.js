document.addEventListener('DOMContentLoaded', function() { 
    console.log("load login")
    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const data = new FormData(loginForm);
        const json = JSON.stringify((Object.fromEntries(data)));
        
        login(json)
        .then(res => {
            localStorage.setItem('access_token', res.access_token)
            console.log(res)
            window.location.href = "index.html"
        }).catch(err => {
            console.log(err)
        })
    })
})