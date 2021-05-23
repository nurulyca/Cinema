document.addEventListener('DOMContentLoaded', function() { 
    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const data = new FormData(loginForm);
        const json = JSON.stringify((Object.fromEntries(data)));
        
        login(json)
        .then(res => {
            localStorage.setItem('access_token_admin', res.access_token)
            // localStorage.setItem('customer_data', JSON.stringify(res))
            console.log("res", res)
            if(!res.message) {
                window.location.href = "index.html"
            }else {
                alert(res.message)
            }
        }).catch(err => {
            console.log("err", err)
        })
    })
})