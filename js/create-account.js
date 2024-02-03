async function createAccount() {
    // Get username and password values
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Define data to be sent
    const data = {
        Name: name,
        Username: username,
        Password: password,
    };

    // Define request options
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };

    try {
        // Send request to server
        const response = await fetch('http://localhost:8002/api/accounts', requestOptions);

        // Handle successful login
        if (response.status === 201) {
            // Clear error message
            document.getElementById("error-message").innerHTML = '';
            // Show success message
            alert('New account creation successful.');

            // Parse response data
            const resData = await response.json();
            console.log('Response:', resData);

            // Redirect to login page
            window.location.href = "../login.html"
        } else if (response.status === 409) {               // Handle incorrect username or password
            const outputHTML = 'Error: Username already exists. Please try again.';
            document.getElementById("error-message").innerHTML = outputHTML;
        } else if (response.status === 500) {               // Handle non-existent account
            const outputHTML = 'Error: Unable to create new user'
            document.getElementById("error-message").innerHTML = outputHTML;
        } else {                                            // Handle unexpected error
            const outputHTML = 'An unexpected error occured, please try again later.'
            document.getElementById("error-message").innerHTML = outputHTML;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('createNewAccButton').addEventListener('click', function(event) {
    event.preventDefault();
    createAccount();
});

document.getElementById('cancelButton').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "../login.html";
});
