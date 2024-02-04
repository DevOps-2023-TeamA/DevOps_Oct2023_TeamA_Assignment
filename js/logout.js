function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = "../login.html"
}

document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();
    eraseCookie("jwtToken");
});