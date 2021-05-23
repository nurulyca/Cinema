document.addEventListener('DOMContentLoaded', function() {
  let customer_data = JSON.parse(localStorage.getItem('customer_data'))
  const totalAmount = document.querySelector('.left-amount');
  console.log("load");
  saldoLeft(customer_data.wallet_id)
  .then(res => {
    console.log(res)
    totalAmount.innerHTML = "Current saldo (IDR) :" + " " + res[0].total_amount
    })

    let amount = 0;
    mon50.onclick = () => {
        var x = document.getElementById("loginForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
        amount = 50000;
    }
    mon100.onclick = () => {
        var x = document.getElementById("loginForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
        amount = 100000;
    }
    mon150.onclick = () => {
        var x = document.getElementById("loginForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
        amount = 150000;
    }
    mon200.onclick = () => {
        var x = document.getElementById("loginForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
        amount = 200000
    }
    mon250.onclick = () => {
        var x = document.getElementById("loginForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
        amount = 250000;
    }
    mon300.onclick = () => {
        var x = document.getElementById("loginForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
        amount = 300000;
    };

    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const data = new FormData(loginForm);
        const json = JSON.stringify((Object.fromEntries(data)));
        
        login(json)
        .then(res => {
            const payload = {
              total_amount: amount
            }
            const json = JSON.stringify(payload);

            topUp(json, res.access_token, customer_data.wallet_id)
              .then(result => {
                console.log(result)
                window.location.reload()
              })
            console.log("res", res)
            console.log("amount", amount)
            if(!res.message) {
            }else {
                alert(res.message)
            }
        }).catch(err => {
            console.log("err", err)
        })
    })

});