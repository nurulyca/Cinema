document.addEventListener('DOMContentLoaded', function() {
    console.log("load")

    mon50.onclick = () => {
        var x = document.getElementById("loginAdmin")
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }
})