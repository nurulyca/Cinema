document.addEventListener('DOMContentLoaded', function() {
    const dataCustomer = JSON.parse(localStorage.getItem("customer_data"))
    const updateName = document.querySelector('input[name="updatename"]');
    const updatePassword = document.querySelector('input[name="updatepassword"]');
    const updateEmail = document.querySelector('input[name="updateemail"]');
    const toggleEdit = document.getElementById("toggle-edit")
    const emailText = document.querySelector('.email');
    emailText.innerHTML = dataCustomer.email
    const nameText = document.querySelector('.name');
    nameText.innerHTML = dataCustomer.name

    toggleEdit.onclick = () => {
        updateName.value = dataCustomer.name
        updateEmail.value = dataCustomer.email
        var x = document.getElementById("updateForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }
});

const updateForm = document.querySelector('#updateForm');
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(updateForm);
    const objectData = Object.fromEntries(data)
    const payload = {
        customer_name : objectData.updatename,
        customer_email : objectData.updateemail,
        customer_password : objectData.updatepassword
    }
    const json = JSON.stringify(payload);
    const token = localStorage.getItem('access_token');
    
    fetch('http://localhost:5000/update_customer/', {
    method: 'PUT',
    headers: { 
      'Content-Type' : 'application/json',
      'access_token' : token
    },
    body: json
  })
  .then(res => res.json())
  .then(jsonRes => {
    console.log(jsonRes)
    localStorage.setItem('customer_data', JSON.strin)
    window.location.reload()
  })

})
