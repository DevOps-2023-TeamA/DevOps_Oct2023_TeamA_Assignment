window.onload = () => {
    const nameField = document.getElementById("name").setAttribute("value", localStorage.getItem("tempName"))
    const usernameField = document.getElementById("username").setAttribute("value", localStorage.getItem("tempUsername"))
    const roleField = document.getElementById("role").innerHTML += `${localStorage.getItem("tempRole")} <i class="mdi mdi-chevron-down"></i>`

    localStorage.removeItem("tempName")
    localStorage.removeItem("tempUsername")
    localStorage.removeItem("tempRole")
}

document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();
    eraseCookie("jwtToken");
});