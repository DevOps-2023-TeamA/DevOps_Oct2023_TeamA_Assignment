window.onload = () => {
    const nameField = document.getElementById("name").setAttribute("value", localStorage.getItem("tempName"))
    const usernameField = document.getElementById("username").setAttribute("value", localStorage.getItem("tempUsername"))
    const roleField = document.getElementById("role").innerHTML += `${localStorage.getItem("tempRole")}<i class="mdi mdi-chevron-down"></i>`

    localStorage.removeItem("tempName")
    localStorage.removeItem("tempUsername")
    localStorage.removeItem("tempRole")
}

document.getElementById('editAccButton').addEventListener('click', function(event) {
    event.preventDefault();
    editAccount();
});

document.getElementById('cancelButton').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "../accounts-management.html";
});

function selectRole(role) {
    document.getElementById('role').innerHTML = `${role}<i class="mdi mdi-chevron-down"></i>`;
}

async function editAccount() {
    // Get name, username and role values
    const name = document.getElementById("name").value
    const username = document.getElementById("username").value
    const role = document.getElementById("role").innerText

    // Define data to be sent
    const data = {
        Name: name,
        Username: username,
        Role: role,
    };

    // Define request options
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };

    try {
        // Send request to server
        const response = await fetch(`http://localhost:8002/api/accounts/${localStorage.getItem("tempID")}`, requestOptions);
        localStorage.removeItem("tempID")

        // Handle successful login
        if (response.status === 202) {
            // Clear error message
            document.getElementById("errorMessage").innerHTML = '';
            // Show success message
            Swal.fire({
                title: 'Success',
                text: `${name}'s account has been modified`,
                icon: 'success',
                confirmButtonColor: '#5156be',
            }).then(() => window.location.href = "../accounts-management.html");
        } else if (response.status === 404) {               // SHOULD NOT OCCUR
            const outputHTML = 'Error: Account ID does not exist. Please try again.';
            document.getElementById("errorMessage").innerHTML = outputHTML;
        } else if (response.status === 500) {               // Handle non-existent account
            const outputHTML = 'Error: Unable to create change account password'
            document.getElementById("errorMessage").innerHTML = outputHTML;
        } else {                                            // Handle unexpected error
            const outputHTML = 'An unexpected error occured, please try again later.'
            document.getElementById("errorMessage").innerHTML = outputHTML;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}