async function sendAuthRequest() {
    // Get the values from the text inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create the JSON object
    const data = {
        Username: username,
        Password: password
    };

    // Set the request options
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    try {
        // Send the POST request
        const response = await fetch('http://localhost:8000/api/auth', requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Handle the response
        const responseData = await response.json();
        console.log('Response:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('loginButton').addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Call the sendAuthRequest function
    sendAuthRequest();
});