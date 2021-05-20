document.addEventListener('DOMContentLoaded', function() {
    console.log("load")
    const name = document.querySelector('.name')


    const toggleEdit = document.getElementById("toggle-edit")

    toggleEdit.onclick = () => {

        var x = document.getElementById("updateForm")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }
})