window.onload = () => {
    document.getElementById("password").setAttribute("disabled", "")
    document.getElementById("password").setAttribute("value", localStorage.getItem("tempPassword"))

    localStorage.removeItem("tempPassword")
}

document.getElementById('changePasswordButton').addEventListener('click', function(event) {
    event.preventDefault();

    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value

    if (password1 !== password2) {
        const outputHTML = 'Error: Passwords do not match.';
        document.getElementById("errorMessage").innerHTML = outputHTML;
    } else {
        changePassword(password1)
    }
});

async function changePassword(password) {
    // Define request options
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(password),
    };

    try {
        // Send request to server
        const response = await fetch(`${ACCOUNTS_SERVICE}/modify-password/${localStorage.getItem("tempID")}`, requestOptions);

        // Handle successful login
        if (response.status === 202) {
            // Clear error message
            document.getElementById("errorMessage").innerHTML = '';
            // Show success message
            Swal.fire({
                title: 'Success',
                text: `${sessionStorage.getItem("Name")}'s account password has been modified`,
                icon: 'success',
                confirmButtonColor: '#5156be',
            }).then(() => window.location.href = "../accounts-management.html");
        } else if (response.status === 404) {               // Handle incorrect username or password
            const outputHTML = 'Error: There was no change in your password. Please try again.';
            document.getElementById("errorMessage").innerHTML = outputHTML;
        } else if (response.status === 500) {               // Handle non-existent account
            const outputHTML = 'Error: Unable to change password'
            document.getElementById("errorMessage").innerHTML = outputHTML;
        } else {                                            // Handle unexpected error
            const outputHTML = 'An unexpected error occured, please try again later.'
            document.getElementById("errorMessage").innerHTML = outputHTML;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}