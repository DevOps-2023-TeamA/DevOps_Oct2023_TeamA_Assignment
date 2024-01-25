async function sendAuthRequest() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        Username: username,
        Password: password
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch('http://localhost:8000/api/auth', requestOptions);

        if (response.status === 202) {
            document.getElementById("error-message").innerHTML = '';
            alert('Login successful.');

            const resData = await response.json();
            console.log('Response:', resData);
            setCookie('jwtToken',resData["Token"],30)
            
            sessionStorage.setItem("ID", resData["ID"])
            sessionStorage.setItem("Name", resData["Name"])
            sessionStorage.setItem("Role", resData["Role"])
            
            window.location.href = "../index.html"
        } else if (response.status === 403) {
            const outputHTML = 'Error: Incorrect username or password! Please try again.';
            document.getElementById("error-message").innerHTML = outputHTML;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    sendAuthRequest();
});