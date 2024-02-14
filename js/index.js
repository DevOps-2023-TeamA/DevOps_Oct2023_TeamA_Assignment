// Set welcome message and buttons based on role
window.onload = () => {
    // Get JWT token from cookie
    if (getCookie("jwtToken") !== null) {
        // Set welcome message
        document.getElementById("roleWelcome").innerHTML = `Hi ${sessionStorage.getItem("Name")} (${sessionStorage.getItem("Role")})`

        // Define outputHTML based on role
        if (sessionStorage.getItem("Role") === "Administrator") {
            outputHTML = `
                <a type="button" class="btn btn-primary waves-effect waves-light" style="margin: 0 20px;" href="createentry.html">
                    <i class="mdi mdi-text-box-plus-outline"></i> Create Records
                </a>
                <a type="button" class="btn btn-primary waves-effect waves-light" style="margin: 0 20px;" href="accounts-put.html">
                    <i class="mdi mdi-account-edit-outline"></i> Modify Accounts
                </a>
                <a type="button" class="btn btn-primary waves-effect waves-light" style="margin: 0 20px;" href="queryentryform.html">
                    <i class="mdi mdi-text-box-search-outline"></i> Query Records
                </a>`
        } else if (sessionStorage.getItem("Role") === "User") {
            outputHTML = `
                <a type="button" class="btn btn-primary waves-effect waves-light" style="margin: 0 20px;" href="createentry.html">
                    <i class="mdi mdi-text-box-plus-outline"></i> Create Records
                </a>
                <a type="button" class="btn btn-primary waves-effect waves-light" style="margin: 0 20px;" href="queryentryform.html">
                    <i class="mdi mdi-text-box-search-outline"></i> Query Records
                </a>`
        }
        // Insert role-specific buttons
        document.getElementById("roleButtons").innerHTML = outputHTML
    }
}

// Function to get cookie value
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}